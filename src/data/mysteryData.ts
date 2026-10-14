export interface MysteryItem {
  id: string;
  targetName: string;
  category: string;
  origin: string;
  clues: [string, string, string]; // Clue 1 (Hard/Philosophical), Clue 2 (Medium/Geographic), Clue 3 (Direct/Visual)
  options: string[];
  correctAnswer: string;
  funFact: string;
  iconName: string;
}

export const MYSTERY_ITEMS: MysteryItem[] = [
  {
    id: 'm1',
    targetName: 'Rumah Honai',
    category: 'Rumah Adat',
    origin: 'Papua (Lembah Baliem)',
    clues: [
      'Bangunan ini dirancang sengaja tanpa jendela dan berpintu sempit guna mempertahankan suhu panas dari tiupan angin pegunungan yang menusuk.',
      'Berasal dari suku Dani di pedalaman Papua, memiliki perapian di tengah lantai untuk menghangatkan tubuh dan memasak ubi.',
      'Bentuknya silinder melingkar mungil menyerupai payung jamur dengan atap terbuat dari susunan jerami dan ilalang tebal.'
    ],
    options: ['Rumah Gadang', 'Rumah Honai', 'Rumah Joglo', 'Rumah Lamin'],
    correctAnswer: 'Rumah Honai',
    funFact: 'Tinggi rumah Honai hanya sekitar 2,5 meter dan atap jerami mencegah air hujan langsung membasahi dinding kayu.',
    iconName: 'Home',
  },
  {
    id: 'm2',
    targetName: 'Alat Musik Sasando',
    category: 'Alat Musik Tradisional',
    origin: 'Pulau Rote, Nusa Tenggara Timur',
    clues: [
      'Bagian wadah resonansi bunyi alat musik ini unik karena dianyam dari helaian daun pohon lontar yang mekar menyerupai kipas.',
      'Berasal dari kepulauan terselatan Indonesia (Pulau Rote NTT) dan memiliki dawai petik yang melingkar pada tabung bambu.',
      'Gambarnya pernah diabadikan di mata uang kertas pecahan Rp 5.000 keluaran Bank Indonesia tahun 2001.'
    ],
    options: ['Angklung', 'Kolintang', 'Sasando', 'Tifa'],
    correctAnswer: 'Sasando',
    funFact: 'Sasando modern kini ada versi elektrik yang bisa dihubungkan ke pengeras suara gitar!',
    iconName: 'Music',
  },
  {
    id: 'm3',
    targetName: 'Rumah Gadang',
    category: 'Rumah Adat',
    origin: 'Sumatera Barat (Minangkabau)',
    clues: [
      'Konstruksi bangunannya sangat elastis dan tahan terhadap getaran gempa bumi karena menggunakan sistem pasak kayu tanpa paku besi.',
      'Berasal dari kebudayaan yang menganut garis kekerabatan Matrilineal (pihak ibu) di Ranah Minang.',
      'Ciri paling mencolok adalah lengkungan atap panggungnya yang menjulang runcing ke atas menyerupai tanduk kerbau (Gonjong).'
    ],
    options: ['Rumah Tongkonan', 'Rumah Gadang', 'Rumah Betang', 'Rumah Bolon'],
    correctAnswer: 'Rumah Gadang',
    funFact: 'Jumlah tiang dan lekukan gonjong melambangkan tingkatan kepemimpinan adat datuk dan penghulu di Minangkabau.',
    iconName: 'Home',
  },
  {
    id: 'm4',
    targetName: 'Tari Saman',
    category: 'Tarian Tradisional',
    origin: 'Gayo, Aceh',
    clues: [
      'Tarian ini tidak diiringi alat musik eksternal, melainkan memanfaatkan bunyi tepuk tangan, tepuk dada, dan lantunan syair penarinya sendiri.',
      'Ditetapkan oleh UNESCO sebagai Daftar Warisan Budaya Takbenda Dunia dan dijuluki bangsa barat sebagai "Dance of a Thousand Hands".',
      'Ditarikan oleh puluhan pria dalam posisi bersimpuh rapat secara berjajar dengan kecepatan dan sinkronisasi gerakan yang sangat menakjubkan.'
    ],
    options: ['Tari Piring', 'Tari Saman', 'Tari Kecak', 'Tari Tor-Tor'],
    correctAnswer: 'Tari Saman',
    funFact: 'Syair Tari Saman berisi nasihat keagamaan, budi pekerti, persaudaraan, dan kepahlawanan dalam bahasa Gayo.',
    iconName: 'Sparkles',
  },
  {
    id: 'm5',
    targetName: 'Senjata Mandau',
    category: 'Senjata Tradisional',
    origin: 'Kalimantan (Suku Dayak)',
    clues: [
      'Senjata ini memiliki nilai spiritual tinggi bagi penjaga rimba dan hanya boleh dicabut dari sarungnya jika dalam keadaan sangat terdesak.',
      'Berasal dari suku Dayak di Kalimantan, gagangnya sering diukir dari tanduk rusa atau kayu ulin dan dihiasi bulu burung enggang.',
      'Bilah pedang bermata satu dengan sisi punggung agak tebal bertatahkan lempengan tembaga bermotif khas hutan Borneo.'
    ],
    options: ['Keris', 'Rencong', 'Mandau', 'Badik'],
    correctAnswer: 'Mandau',
    funFact: 'Burung Enggang bagi masyarakat Dayak adalah lambang kedamaian, kesetiaan, dan pelindung kehidupan.',
    iconName: 'Sword',
  },
  {
    id: 'm6',
    targetName: 'Rumah Tongkonan',
    category: 'Rumah Adat',
    origin: 'Tana Toraja, Sulawesi Selatan',
    clues: [
      'Tiang utama di bagian depan rumah ini lazim dipasangi tanduk-tanduk kerbau secara vertikal sebagai penanda status sosial keluarga.',
      'Berasal dari dataran tinggi Tana Toraja di Sulawesi Selatan dan menjadi pusat berkumpulnya seluruh rumpun keluarga besar.',
      'Atapnya melengkung megah menyerupai perahu terbalik menghadap ke arah utara (tempat leluhur dipercaya berasal).'
    ],
    options: ['Rumah Joglo', 'Rumah Baileo', 'Rumah Tongkonan', 'Rumah Honai'],
    correctAnswer: 'Rumah Tongkonan',
    funFact: 'Kata Tongkonan berasal dari kata "tongkon" yang berarti "duduk bersama untuk bermusyawarah".',
    iconName: 'Home',
  },
  {
    id: 'm7',
    targetName: 'Alat Musik Kolintang',
    category: 'Alat Musik Tradisional',
    origin: 'Minahasa, Sulawesi Utara',
    clues: [
      'Namanya diambil dari tiruan suara bilah kayunya saat dipukul: bunyi "tong" nada rendah, "ting" nada tinggi, dan "tang" nada sedang.',
      'Berasal dari tanah Minahasa di Sulawesi Utara, dimainkan menggunakan pemukul kayu khusus berkepala kain atau karet.',
      'Merupakan alat musik perkusi melodis yang bilah-bilah kayunya ditata rapi di atas peti resonator kayu layaknya gambang.'
    ],
    options: ['Gamelan', 'Kolintang', 'Saluang', 'Sampe'],
    correctAnswer: 'Kolintang',
    funFact: 'Kayu yang digunakan biasanya kayu cempaka atau kayu telur yang bertekstur ringan namun kuat menghasilkan dengungan merdu.',
    iconName: 'Music',
  },
  {
    id: 'm8',
    targetName: 'Rendang Daging',
    category: 'Makanan Khas',
    origin: 'Sumatera Barat',
    clues: [
      'Proses memasaknya butuh kesabaran tinggi hingga santan menguap habis dan minyak alaminya membuat masakan awet berminggu-minggu tanpa bahan kimia pengawet.',
      'Pernah dinobatkan oleh CNN Internasional sebagai urutan nomor satu dalam daftar "World’s 50 Most Delicious Foods".',
      'Olahan daging sapi dengan rempah lengkuas, serai, cabai, dan santan yang diaduk terus hingga berwarna cokelat gelap kehitaman.'
    ],
    options: ['Gudeg', 'Rawon', 'Rendang Daging', 'Coto Makassar'],
    correctAnswer: 'Rendang Daging',
    funFact: 'Bagi masyarakat Minang, 4 bahan rendang punya filosofi: Daging (para niniak mamak), Kelapa (kaum intelektual), Cabai (alim ulama), dan Bumbu (keseluruhan masyarakat).',
    iconName: 'Utensils',
  },
];
