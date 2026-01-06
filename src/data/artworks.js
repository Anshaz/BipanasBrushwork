const artworks = [
    {
        id: 'artwork-1',
        image: '/Annapurna.jpg',
        title: 'Annapurna Serenity',
        medium: 'Acrylic on Canvas',
        year: '2024',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/1786945387/hand-painted-annapurna-mountain-acrylic',
        latestWork: true,
        isFeatured: false,
        dimensions: ''
    },
    {
        id: 'artwork-2',
        image: '/Everest.jpg',
        title: 'Everest Majesty',
        medium: 'Acrylic on Canvas',
        year: '2024',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/1659202939/mount-everest-acrylic-painting-himalayan',
        latestWork: false,
        isFeatured: true,
        dimensions: ''

    },
    {
        id: 'artwork-3',
        image: '/EverestVillage.jpg',
        title: 'Everest Village',
        medium: 'Acrlic on Canvas',
        year: '2024',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/1659158225/textured-mount-everest-painting-original',
        latestWork: false,
        isFeatured: false,
        dimensions: ''

    },
    {
        id: 'artwork-4',
        image: '/Kilimanjaro.jpg',
        title: 'Mount Kilimanjaro',
        medium: 'Acrlic on Canvas',
        year: '2025',
        onEtsy: false,
        etsyLink: '',
        latestWork: true,
        isFeatured: true,
        dimensions: ''

    },
    {
        id: 'artwork-5',
        image: '/sailing.jpg',
        title: 'Sailing Ship Vintage',
        medium: 'Oil on Canvas',
        year: '2025',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/4433602459/vintage-sailing-ship-oil-fabric-painting',
        latestWork: false,
        isFeatured: false,
        dimensions: ''

    },
    {
        id: 'artwork-6',
        image: '/MountainVillage.jpg',
        title: 'Mountain Village',
        medium: 'Acrlic on Canvas',
        year: '2024',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/4429589187/hand-painted-machapuchare-fish-tail',
        latestWork: true,
        isFeatured: false,
        dimensions: ''

    },
    {
        id: 'artwork-7',
        image: '/Hallstatt.jpg',
        title: 'Hallstatt Austria',
        medium: 'Acrlic on Canvas',
        year: '2023',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/1634848506/handmade-hallstatt-austria-acrylic',
        latestWork: false,
        isFeatured: true,
        dimensions: ''

    },
    {
        id: 'artwork-8',
        image: '/Sunset.jpg',
        title: 'Sunset Bliss',
        medium: 'Oil on Canvas',
        year: '2024',
        onEtsy: false,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/1773626307/handmade-sunset-oil-painting-dramatic',
        latestWork: false,
        isFeatured: false,
        dimensions: ''

    },
    {
        id: 'artwork-9',
        image: '/PanaromaEverest.jpg',
        title: 'Everest Panorama',
        medium: 'Acrlic on Canvas',
        year: '2025',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/1848887830/annapurna-nepal-acrylic-painting',
        latestWork: false,
        isFeatured: false,
        dimensions: ''

    },
    {
        id: 'artwork-10',
        image: '/Palampur.jpg',
        title: 'Palampur Hills',
        medium: 'Acrlic on Canvas',
        year: '2025',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/1718248803/himalayan-landscape-oil-painting',
        latestWork: false,
        isFeatured: false,
        dimensions: ''

    },
    {
        id: 'artwork-11',
        image: '/EverestVillagecolorful.jpg',
        title: 'Everest Village Colorful',
        medium: 'Acrlic on Canvas',
        year: '2025',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/1857793831/mount-everest-painting-textured-acrylic',
        latestWork: false,
        isFeatured: true,
        dimensions: ''

    },
    {
        id: 'artwork-12',
        image: '/HimalayaYak.jpg',
        title: 'Himalaya Yak',
        medium: 'Acrlic on Canvas',
        year: '2025',
        onEtsy: false,
        etsyLink: '',
        latestWork: false,
        isFeatured: false,
        dimensions: ''

    },
    {
        id: 'artwork-13',
        image: '/LadyInWhite.jpg',
        title: 'Lady in White',
        medium: 'Acrlic on Canvas',
        year: '2025',
        onEtsy: false,
        etsyLink: '',
        latestWork: false,
        isFeatured: false,
        dimensions: ''

    },
    {
        id: 'artwork-14',
        image: '/CloudyMountains.jpg',
        title: 'Cloudy Mountains',
        medium: 'Acrlic on Canvas',
        year: '2025',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/4428567553/himalaya-range-acrylic-painting',
        latestWork: false,
        isFeatured: true,
        dimensions: ''

    },
    {
        id: 'artwork-15',
        image: '/Jam on Toast.jpg',
        title: 'Jam on Toast',
        medium: 'Acrlic on Canvas',
        year: '2025',
        onEtsy: false,
        etsyLink: '',
        latestWork: false,
        isFeatured: false,
        dimensions: ''

    },
    {
        id: 'artwork-16',
        image: '/Peanut Butter on Toast.jpg',
        title: 'Peanut Butter on Toast',
        medium: 'Acrlic on Canvas',
        year: '2025',
        onEtsy: false,
        etsyLink: '',
        latestWork: false,
        isFeatured: false,
        dimensions: ''

    },
    {
        id: 'artwork-17',
        image: '/sevenhorses.jpg',
        title: 'Seven Horses',
        medium: 'Acrlic on Canvas',
        year: '2023',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/4428589164/seven-lucky-horses-handmade-vastu-energy',
        latestWork: false,
        isFeatured: true,
        dimensions: ''

    },
        {
        id: 'artwork-18',
        image: '/MountainAbstract.jpg',
        title: 'Abstract Mountains',
        medium: 'Acrlic on Canvas',
        year: '2024',
        onEtsy: true,
        etsyLink: 'https://bipanasbrushwork.etsy.com/de-en/listing/1794469801/mount-everest-painting-abstract-himalaya',
        latestWork: false,
        isFeatured: false,
        dimensions: ''

    }
];

export default artworks;
