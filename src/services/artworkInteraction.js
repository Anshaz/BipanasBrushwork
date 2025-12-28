import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  getDoc,
  updateDoc,
  increment 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Comments Collection
export const commentsCollection = collection(db, 'comments');

// Likes Collection
export const likesCollection = collection(db, 'likes');

// Add a comment
export const addComment = async (artworkId, userId, userName, content) => {
  try {
    const comment = {
      artworkId,
      userId,
      userName,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(commentsCollection, comment);
    return { id: docRef.id, ...comment };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments for an artwork
export const getComments = async (artworkId) => {
  try {
    const q = query(
      commentsCollection,
      where('artworkId', '==', artworkId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
};

// Delete a comment (only by owner or admin)
export const deleteComment = async (commentId, userId) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) {
      throw new Error('Comment not found');
    }
    
    const commentData = commentDoc.data();
    if (commentData.userId !== userId) {
      throw new Error('You can only delete your own comments');
    }
    
    await deleteDoc(commentRef);
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Like an artwork
export const likeArtwork = async (artworkId, userId) => {
  try {
    // Check if already liked
    const q = query(
      likesCollection,
      where('artworkId', '==', artworkId),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Unlike - remove the like
      const likeDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, 'likes', likeDoc.id));
      return { liked: false };
    } else {
      // Like - add the like
      const like = {
        artworkId,
        userId,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(likesCollection, like);
      return { liked: true };
    }
  } catch (error) {
    console.error('Error liking artwork:', error);
    throw error;
  }
};

// Check if user liked an artwork
export const checkUserLike = async (artworkId, userId) => {
  try {
    const q = query(
      likesCollection,
      where('artworkId', '==', artworkId),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking like:', error);
    return false;
  }
};

// Get like count for an artwork
export const getLikeCount = async (artworkId) => {
  try {
    const q = query(
      likesCollection,
      where('artworkId', '==', artworkId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
};