// src/services/artworkInteraction.js - UPDATED
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
  setDoc 
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

// Delete a comment
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
    // Create a unique ID for the like (artworkId_userId)
    const likeId = `${artworkId}_${userId}`;
    const likeRef = doc(db, 'likes', likeId);
    const snap = await getDoc(likeRef);

    if (snap.exists()) {
      // Unlike - remove the like
      await deleteDoc(likeRef);
      return { liked: false };
    } else {
      // Like - add the like
      await setDoc(likeRef, {
        artworkId,
        userId,
        createdAt: new Date().toISOString()
      });
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
    const likeId = `${artworkId}_${userId}`;
    const likeRef = doc(db, 'likes', likeId);
    const snap = await getDoc(likeRef);
    return snap.exists();
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

// Get all likes (for debugging)
export const getAllLikes = async () => {
  try {
    const querySnapshot = await getDocs(likesCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all likes:', error);
    return [];
  }
};

// Get all likes by a specific user
export const getLikesByUser = async (userId) => {
  try {
    const q = query(
      likesCollection,
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const likes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return likes;
  } catch (error) {
    console.error('Error getting user likes:', error);
    return [];
  }
};

// Get all comments by a specific user
export const getCommentsByUser = async (userId) => {
  try {
    const q = query(
      commentsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return comments;
  } catch (error) {
    console.error('Error getting user comments:', error);
    return [];
  }
};