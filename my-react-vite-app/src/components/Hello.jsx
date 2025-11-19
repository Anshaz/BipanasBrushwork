import React from 'react';

const Hello = () => {
return (
<div className="min-h-screen bg-gray-100 text-gray-900 p-4 flex flex-col items-center">
<header className="w-full max-w-3xl text-center py-6">
<h1 className="text-4xl font-bold mb-2">My Art Portfolio</h1>
<p className="text-lg text-gray-600">Showcasing my artwork beautifully on all devices</p>
</header>


<section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
{[1,2,3,4,5,6].map((i) => (
<div key={i} className="bg-white shadow rounded-2xl overflow-hidden">
<div className="h-48 bg-gray-300" />
<div className="p-3">
<h3 className="text-md font-semibold">Artwork {i}</h3>
</div>
</div>
))}
</section>


<footer className="w-full max-w-3xl text-center py-6 mt-10 text-gray-500">
© {new Date().getFullYear()} My Art Portfolio
</footer>
</div>
);
};

export default Hello;