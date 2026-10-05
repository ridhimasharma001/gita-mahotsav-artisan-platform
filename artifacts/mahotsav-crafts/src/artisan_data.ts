export type Product = { name: string; image: string };
export type Artisan = {
  id: string;
  name: string;
  craft: string;
  category: string;
  origin: string;
  stallNumber: string;
  phone: string;
  story: string;
  coverImage: string;
  profileImage: string;
  products: Product[];
};

export const artisans: Artisan[] = [
  {
    id: '101', name: 'Harjit Kaur', craft: 'Phulkari Embroidery', category: 'Textiles',
    origin: 'Patiala, Punjab', stallNumber: 'A-12', phone: '+91 98720 45136',
    story: 'Harjit learned the language of phulkari at her grandmother’s side, watching flowers take shape one patient stitch at a time. Today she keeps that family tradition alive with hand-spun cotton and colours drawn from Punjab’s fields and festivals.',
    coverImage: '/phulkari-detail.jpg', profileImage: '/harjit-portrait.jpg',
    products: [
      { name: 'Bagh dupatta', image: '/phulkari.jpg' },
      { name: 'Hand-stitched phulkari', image: '/phulkari-detail.jpg' },
      { name: 'Heirloom rumal', image: '/phulkari-scarf.jpg' },
    ],
  },
  {
    id: '102', name: 'Savitri Devi', craft: 'Hand-thrown Terracotta', category: 'Terracotta',
    origin: 'Jhajjar, Haryana', stallNumber: 'B-07', phone: '+91 98124 68215',
    story: 'For three generations, Savitri’s family has shaped the red earth of Jhajjar into objects meant for everyday life. Each vessel is formed on a traditional wheel, fired slowly, and finished by hand in the courtyard workshop she shares with her daughters.',
    coverImage: '/terracotta-vessel.jpg', profileImage: '/savitri-portrait.jpg',
    products: [
      { name: 'Surahi water vessel', image: '/terracotta.jpg' },
      { name: 'Lotus diya set', image: '/terracotta-diyas.jpg' },
      { name: 'Hand-formed planters', image: '/terracotta-vessel.jpg' },
    ],
  },
  {
    id: '103', name: 'Imran Qureshi', craft: 'Rosewood Carving', category: 'Woodcraft',
    origin: 'Saharanpur, Uttar Pradesh', stallNumber: 'C-19', phone: '+91 98970 36428',
    story: 'Imran’s workshop sits among the old lanes of Saharanpur, where the rhythm of a chisel has passed from parent to child for generations. His detailed floral patterns are carved entirely by hand into sustainably sourced rosewood.',
    coverImage: '/wood-panel.jpg', profileImage: '/imran-portrait.jpg',
    products: [
      { name: 'Carved keepsake box', image: '/wood-box.jpg' },
      { name: 'Floral panel', image: '/woodcarving.jpg' },
      { name: 'Rosewood serving tray', image: '/wood-panel.jpg' },
    ],
  },
  {
    id: '104', name: 'Mohd. Aslam', craft: 'Hand-finished Brasswork', category: 'Brasswork',
    origin: 'Moradabad, Uttar Pradesh', stallNumber: 'D-04', phone: '+91 98370 92541',
    story: 'Aslam’s family has worked metal in Moradabad for over sixty years. He combines classic repoussé techniques with a lighter, contemporary touch, shaping each piece before polishing it to reveal the warm glow of the brass.',
    coverImage: '/brass-bowl.jpg', profileImage: '/aslam-portrait.jpg',
    products: [
      { name: 'Etched brass lota', image: '/brass-lota.jpg' },
      { name: 'Table diya', image: '/brasswork.jpg' },
      { name: 'Hand-hammered bowl', image: '/brass-bowl.jpg' },
    ],
  },
  {
    id: '105', name: 'Rukmini Sharma', craft: 'Zari-Zardozi', category: 'Textiles',
    origin: 'Kurukshetra, Haryana', stallNumber: 'A-23', phone: '+91 99962 17430',
    story: 'Rukmini brings the shimmer of zari and the patience of zardozi together in her small Kurukshetra atelier. Her work layers metallic thread, tiny beads and silk, preserving a celebratory embroidery tradition while making it her own.',
    coverImage: '/zari-potli.jpg', profileImage: '/rukmini-portrait.jpg',
    products: [
      { name: 'Zardozi potli', image: '/zari-potli.jpg' },
      { name: 'Embroidered silk panel', image: '/zari.jpg' },
      { name: 'Gold-thread stole', image: '/zari-detail.jpg' },
    ],
  },
];

export const categories = ['All crafts', 'Woodcraft', 'Terracotta', 'Textiles', 'Brasswork'];
export const getArtisan = (id: string) => artisans.find((artisan) => artisan.id === id);
