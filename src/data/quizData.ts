import { QuizQuestion } from '../types/game';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- FAKTOR PENYEBAB KEBERAGAMAN ---
  {
    id: 'q1',
    topic: 'faktor-penyebab',
    topicLabel: 'Faktor Penyebab Keberagaman',
    question: 'Indonesia terletak di antara dua benua (Asia dan Australia) serta dua samudra (Hindia dan Pasifik). Letak strategis ini menyebabkan keberagaman dalam hal...',
    options: [
      'Bentuk dan jenis tanah pertanian',
      'Masuknya berbagai kebudayaan dan agama dari bangsa asing',
      'Jumlah gunung berapi yang aktif',
      'Perbedaan zona waktu di wilayah barat dan timur'
    ],
    correctIndex: 1,
    explanation: 'Letak geografis Indonesia yang strategis pada jalur lalu lintas perdagangan internasional masa lalu menyebabkan pedagang dari India, Arab, Tiongkok, dan Eropa singgah serta menyebarkan kebudayaan dan agama mereka.',
    difficulty: 'mudah',
    hint: 'Pikirkan jalur perdagangan laut internasional yang dilalui para pelaut dunia sejak zaman dahulu.',
  },
  {
    id: 'q2',
    topic: 'faktor-penyebab',
    topicLabel: 'Faktor Penyebab Keberagaman',
    question: 'Kondisi Indonesia sebagai negara kepulauan mengakibatkan setiap kelompok masyarakat di pulau-pulau mengembangkan adat istiadatnya sendiri karena...',
    options: [
      'Hubungan antarpulau pada masa lalu terhambat oleh lautan luas',
      'Pemerintah pusat melarang warga pulau berpindah tempat',
      'Setiap pulau memiliki iklim yang sangat bertolak belakang',
      'Penduduk pulau tidak ingin mengenal kebudayaan lain'
    ],
    correctIndex: 0,
    explanation: 'Kondisi kepulauan menciptakan isolasi geografis di masa lampau, sehingga suku bangsa di masing-masing pulau mengembangkan kebiasaan, bahasa daerah, dan sistem sosial yang khas sesuai lingkungan mereka.',
    difficulty: 'sedang',
    hint: 'Pada masa lalu sarana transportasi laut sangat terbatas sehingga kontak antarpulau jarang terjadi.',
  },
  {
    id: 'q3',
    topic: 'faktor-penyebab',
    topicLabel: 'Faktor Penyebab Keberagaman',
    question: 'Masyarakat yang tinggal di daerah pesisir pantai umumnya bermata pencaharian sebagai nelayan dan memiliki rumah panggung terbuka, sedangkan masyarakat pegunungan bertani dan berbusana tebal. Faktor penyebab perbedaan budaya ini adalah...',
    options: [
      'Perbedaan kondisi alam dan lingkungan fisik',
      'Tingkat kecerdasan penduduk setempat',
      'Pengaruh penjajahan bangsa barat',
      'Perbedaan sistem pemerintahan daerah'
    ],
    correctIndex: 0,
    explanation: 'Kondisi alam seperti iklim, suhu, ketinggian, serta ketersediaan sumber daya alam membentuk mata pencaharian, jenis pakaian, bentuk rumah adat, dan pola hidup masyarakat yang berbeda.',
    difficulty: 'mudah',
    hint: 'Laut versus dataran tinggi pegunungan merupakan bentuk perbedaan...',
  },

  // --- SUKU BANGSA ---
  {
    id: 'q4',
    topic: 'suku',
    topicLabel: 'Keberagaman Suku Bangsa',
    question: 'Menurut sensus Badan Pusat Statistik (BPS), Indonesia memiliki lebih dari...',
    options: [
      '300 suku bangsa',
      '650 suku bangsa',
      '1.340 suku bangsa',
      '2.500 suku bangsa'
    ],
    correctIndex: 2,
    explanation: 'Berdasarkan sensus BPS tahun 2010, terdapat 1.340 suku bangsa di seluruh Nusantara, dengan suku Jawa sebagai populasi suku terbesar.',
    difficulty: 'sedang',
    hint: 'Jumlahnya lebih dari seribu tiga ratus suku!',
  },
  {
    id: 'q5',
    topic: 'suku',
    topicLabel: 'Keberagaman Suku Bangsa',
    question: 'Suku Minangkabau di Sumatera Barat memiliki keunikan sistem kekerabatan yang menarik garis keturunan dari pihak ibu. Sistem kekerabatan ini disebut...',
    options: [
      'Patrilineal',
      'Matrilineal',
      'Bilateral',
      'Parental'
    ],
    correctIndex: 1,
    explanation: 'Sistem Matrilineal menarik garis keturunan dari ibu. Harta pusaka dan nama suku diwariskan melalui garis perempuan.',
    difficulty: 'mudah',
    hint: 'Kata dasarnya berawalan "Matri" yang berkaitan dengan ibu (maternal).',
  },
  {
    id: 'q6',
    topic: 'suku',
    topicLabel: 'Keberagaman Suku Bangsa',
    question: 'Di Pulau Sulawesi, suku yang terkenal dengan rumah adat Tongkonan beratap menyerupai tanduk kerbau/perahu dan upacara pemakaman Rambu Solo adalah suku...',
    options: [
      'Suku Bugis',
      'Suku Makassar',
      'Suku Toraja',
      'Suku Minahasa'
    ],
    correctIndex: 2,
    explanation: 'Suku Toraja mendiami daerah pegunungan Tana Toraja di Sulawesi Selatan dan terkenal dengan rumah Tongkonan serta tradisi pemakaman Rambu Solo di tebing batu.',
    difficulty: 'mudah',
    hint: 'Tana ... di dataran tinggi Sulawesi Selatan.',
  },
  {
    id: 'q7',
    topic: 'suku',
    topicLabel: 'Keberagaman Suku Bangsa',
    question: 'Suku bangsa di Papua yang sangat terkenal di mancanegara dengan keahlian seni ukir kayu patung sakral (Bisj pole) adalah...',
    options: [
      'Suku Asmat',
      'Suku Dani',
      'Suku Arfak',
      'Suku Biak'
    ],
    correctIndex: 0,
    explanation: 'Suku Asmat mendiami pesisir selatan Papua dan terkenal dengan kemampuan memahat dan mengukir kayu dengan motif leluhur bernilai seni tinggi.',
    difficulty: 'sedang',
    hint: 'Nama suku ini diawali huruf A dan sering dipamerkan di museum dunia.',
  },

  // --- AGAMA & KEPERCAYAAN ---
  {
    id: 'q8',
    topic: 'agama',
    topicLabel: 'Keberagaman Agama & Kepercayaan',
    question: 'Kemerdekaan setiap warga negara untuk memeluk agamanya masing-masing dan beribadat menurut agamanya dijamin secara tegas dalam UUD NRI 1945 pasal...',
    options: [
      'Pasal 27 ayat 1',
      'Pasal 28E ayat 3',
      'Pasal 29 ayat 2',
      'Pasal 33 ayat 1'
    ],
    correctIndex: 2,
    explanation: 'Pasal 29 ayat (2) UUD 1945 berbunyi: "Negara menjamin kemerdekaan tiap-tiap penduduk untuk memeluk agamanya masing-masing dan untuk beribadat menurut agamanya dan kepercayaannya itu."',
    difficulty: 'sedang',
    hint: 'Pasal ini berada dalam Bab XI tentang Agama pada UUD 1945.',
  },
  {
    id: 'q9',
    topic: 'agama',
    topicLabel: 'Keberagaman Agama & Kepercayaan',
    question: 'Pasangan nama agama resmi di Indonesia beserta tempat ibadahnya yang tepat di bawah ini adalah...',
    options: [
      'Islam - Pura',
      'Hindu - Vihara',
      'Khonghucu - Klenteng / Litang',
      'Buddha - Katedral'
    ],
    correctIndex: 2,
    explanation: 'Tempat ibadah Khonghucu adalah Klenteng atau Litang. Tempat ibadah Islam adalah Masjid, Hindu adalah Pura, dan Buddha adalah Vihara.',
    difficulty: 'mudah',
    hint: 'Periksa kembali tempat ibadah bagi pemeluk agama Khonghucu.',
  },
  {
    id: 'q10',
    topic: 'agama',
    topicLabel: 'Keberagaman Agama & Kepercayaan',
    question: 'Hari raya keagamaan umat Hindu yang dirayakan dengan tidak menyalakan api, tidak bepergian, tidak bekerja, dan tidak bersenang-senang selama 24 jam disebut...',
    options: [
      'Galungan',
      'Kuningan',
      'Nyepi',
      'Saraswati'
    ],
    correctIndex: 2,
    explanation: 'Hari Raya Nyepi adalah tahun baru Saka bagi umat Hindu di mana dilaksanakan Catur Brata Penyepian (Amati Geni, Amati Karya, Amati Lelungan, Amati Lelanguan).',
    difficulty: 'mudah',
    hint: 'Berasal dari kata "sepi" yang menandakan keheningan batin.',
  },

  // --- RAS ---
  {
    id: 'q11',
    topic: 'ras',
    topicLabel: 'Keberagaman Ras',
    question: 'Sebagian besar penduduk di Pulau Sumatera, Jawa, Bali, dan Kalimantan tergolong ke dalam kelompok ras...',
    options: [
      'Melanesoid',
      'Malayan-Mongoloid',
      'Kaukasoid',
      'Australoid'
    ],
    correctIndex: 1,
    explanation: 'Ras Malayan-Mongoloid merupakan kelompok ras terbesar di kepulauan Indonesia barat dan tengah dengan ciri kulit sawo matang, rambut lurus/bergelombang, dan tinggi badan sedang.',
    difficulty: 'sedang',
    hint: 'Kelompok Mongoloid yang menyebar di wilayah Melayu Nusantara.',
  },
  {
    id: 'q12',
    topic: 'ras',
    topicLabel: 'Keberagaman Ras',
    question: 'Masyarakat di wilayah Papua, Maluku, dan Nusa Tenggara Timur umumnya memiliki ciri kulit cokelat gelap hingga hitam dan rambut ikal/keriting lebat. Kelompok ras ini dinamakan...',
    options: [
      'Ras Melanesoid',
      'Ras Kaukasoid',
      'Ras Asiatic Mongoloid',
      'Ras Negrito Afrika'
    ],
    correctIndex: 0,
    explanation: 'Ras Melanesoid mendiami kawasan timur Indonesia (Papua, Kepulauan Maluku, NTT) dan pulau-pulau di Samudra Pasifik.',
    difficulty: 'mudah',
    hint: 'Kata "Mela" merujuk pada pigmen warna kulit yang kaya melanin.',
  },
  {
    id: 'q13',
    topic: 'ras',
    topicLabel: 'Keberagaman Ras',
    question: 'Warga negara Indonesia keturunan Tionghoa, Jepang, dan Korea pada umumnya termasuk ke dalam kelompok ras...',
    options: [
      'Malayan-Mongoloid',
      'Asiatic Mongoloid',
      'Kaukasoid',
      'Weddoid'
    ],
    correctIndex: 1,
    explanation: 'Ras Asiatic Mongoloid mencakup bangsa-bangsa dari Asia Timur dan Asia Utara dengan ciri khas kulit kuning terang dan kelopak mata sipit.',
    difficulty: 'sedang',
    hint: 'Berasal dari kawasan benua Asia daratan bagian timur.',
  },

  // --- BUDAYA, RUMAH, ALAT MUSIK & SENJATA ---
  {
    id: 'q14',
    topic: 'budaya',
    topicLabel: 'Kekayaan Budaya Nusantara',
    question: 'Alat musik tradisional dari Pulau Rote (NTT) yang memanfaatkan daun lontar sebagai ruang resonansi suara adalah...',
    options: [
      'Kolintang',
      'Sasando',
      'Tifa',
      'Angklung'
    ],
    correctIndex: 1,
    explanation: 'Sasando adalah alat musik dawai petik tradisional dari Pulau Rote, NTT, yang bagian melengkungnya dibuat dari anyaman daun lontar.',
    difficulty: 'mudah',
    hint: 'Alat musik petik dawai yang sangat eksotis dari NTT.',
  },
  {
    id: 'q15',
    topic: 'budaya',
    topicLabel: 'Kekayaan Budaya Nusantara',
    question: 'Alat musik bambu dari Jawa Barat yang telah diakui UNESCO sebagai warisan budaya dunia tak benda dan dibunyikan dengan cara digoyang adalah...',
    options: [
      'Calung',
      'Angklung',
      'Suling',
      'Gamelan Degung'
    ],
    correctIndex: 1,
    explanation: 'Angklung dari tanah Sunda (Jawa Barat) dimainkan secara bersama-sama dengan digoyangkan, mengajarkan nilai keharmonisan dan gotong royong.',
    difficulty: 'mudah',
    hint: 'Terkenal lewat Saung Udjo di Bandung.',
  },
  {
    id: 'q16',
    topic: 'budaya',
    topicLabel: 'Kekayaan Budaya Nusantara',
    question: 'Rumah adat tradisional masyarakat suku Dani di pedalaman Papua yang beratap jerami/ilalang melingkar setengah bola tanpa jendela disebut...',
    options: [
      'Rumah Joglo',
      'Rumah Gadang',
      'Rumah Honai',
      'Rumah Lamin'
    ],
    correctIndex: 2,
    explanation: 'Rumah Honai beratap jerami tebal dan dinding kayu melingkar tanpa jendela untuk melindungi penghuninya dari udara dingin pegunungan Papua.',
    difficulty: 'mudah',
    hint: 'Bentuknya mungil menyerupai jamur beratap ilalang.',
  },
  {
    id: 'q17',
    topic: 'budaya',
    topicLabel: 'Kekayaan Budaya Nusantara',
    question: 'Senjata tradisional khas suku Dayak di Kalimantan yang dihiasi bulu burung enggang dan ukiran khas adalah...',
    options: [
      'Rencong',
      'Keris',
      'Mandau',
      'Badik'
    ],
    correctIndex: 2,
    explanation: 'Mandau merupakan senjata pusaka khas Dayak yang melambangkan kehormatan, ketegasan, dan hubungan erat dengan alam rimba Kalimantan.',
    difficulty: 'sedang',
    hint: 'Bilah pedang tajam khas pedalaman Kalimantan.',
  },
  {
    id: 'q18',
    topic: 'budaya',
    topicLabel: 'Kekayaan Budaya Nusantara',
    question: 'Kuliner tradisional dari Maluku dan Papua berbahan dasar tepung sagu kenyal yang disantap bersama kuah ikan kuning beraroma kunyit adalah...',
    options: [
      'Gudeg',
      'Papeda',
      'Pempek',
      'Coto Makassar'
    ],
    correctIndex: 1,
    explanation: 'Papeda merupakan makanan pokok khas Papua dan Maluku berbahan sagu dengan tekstur kenyal lengket disajikan bersama kuah ikan tongkol/mubara kuah kuning.',
    difficulty: 'mudah',
    hint: 'Dimakan menggunakan sumpit bambu bergigi dua yang diputar.',
  },

  // --- TOLERANSI & BHINNEKA TUNGGAL IKA ---
  {
    id: 'q19',
    topic: 'toleransi',
    topicLabel: 'Semangat Bhinneka Tunggal Ika',
    question: 'Semboyan "Bhinneka Tunggal Ika" pertama kali tertulis dalam kitab kuno bernama Sutasoma yang dikarang oleh seorang pujangga Majapahit bernama...',
    options: [
      'Mpu Sedah',
      'Mpu Prapanca',
      'Mpu Tantular',
      'Mpu Gandring'
    ],
    correctIndex: 2,
    explanation: 'Semboyan Bhinneka Tunggal Ika berasal dari Kakawin Sutasoma karangan Mpu Tantular pada masa Kerajaan Majapahit abad ke-14.',
    difficulty: 'mudah',
    hint: 'Pujangga agung Majapahit yang nama depannya berawalan T.',
  },
  {
    id: 'q20',
    topic: 'toleransi',
    topicLabel: 'Semangat Bhinneka Tunggal Ika',
    question: 'Sikap menganggap bahwa kebudayaan atau sukunya sendiri jauh lebih unggul dan meremehkan kebudayaan suku bangsa lain disebut sikap...',
    options: [
      'Etnosentrisme',
      'Nasionalisme',
      'Patriotisme',
      'Pluralisme'
    ],
    correctIndex: 0,
    explanation: 'Etnosentrisme adalah kecenderungan memandang budaya sendiri sebagai standar terbaik dan memandang rendah budaya lain, yang dapat memicu perpecahan bangsa.',
    difficulty: 'sedang',
    hint: 'Berakar dari kata "etnis" (suku) dan "sentris" (berpusat pada diri sendiri).',
  },
  {
    id: 'q21',
    topic: 'toleransi',
    topicLabel: 'Semangat Bhinneka Tunggal Ika',
    question: 'Ketika seorang teman sekelasmu sedang menjalankan ibadah puasa, tindakan terpuji yang mencerminkan sikap toleransi adalah...',
    options: [
      'Makan dan minum secara terang-terangan di hadapannya',
      'Menghormatinya dengan tidak sengaja memamerkan makanan di depannya',
      'Menyuruhnya untuk membatalkan puasa agar bisa bermain bersama',
      'Menjauhinya dan tidak mau berteman dengannya selama ia berpuasa'
    ],
    correctIndex: 1,
    explanation: 'Menghormati teman yang sedang beribadah dengan penuh empati dan tidak mengganggu kekhidmatan ibadahnya merupakan wujud nyata toleransi beragama.',
    difficulty: 'mudah',
    hint: 'Pilihlah tindakan yang mengedepankan empati dan tenggang rasa.',
  },
  {
    id: 'q22',
    topic: 'toleransi',
    topicLabel: 'Semangat Bhinneka Tunggal Ika',
    question: 'Tradisi kearifan lokal di Maluku yang menjalin ikatan persaudaraan erat antara desa-desa yang berbeda agama (Muslim dan Kristen) dikenal dengan nama...',
    options: [
      'Pela Gandong',
      'Subak',
      'Rambu Solo',
      'Dalihan Na Tolu'
    ],
    correctIndex: 0,
    explanation: 'Pela Gandong adalah sistem kekerabatan tradisional di Maluku yang mengikat desa-desa Muslim dan Kristen sebagai saudara kandung untuk saling menjaga perdamaian.',
    difficulty: 'sulit',
    hint: 'Berarti "ikatan persaudaraan sekandung" di Maluku.',
  },
  {
    id: 'q23',
    topic: 'faktor-penyebab',
    topicLabel: 'Faktor Penyebab Keberagaman',
    question: 'Masyarakat suku Baduy Dalam di Banten memilih untuk mempertahankan adat istiadat leluhur dan membatasi pengaruh teknologi modern. Hal ini menunjukkan faktor keberagaman berupa...',
    options: [
      'Letak strategis jalur maritim',
      'Penerimaan masyarakat terhadap perubahan sosial',
      'Perbedaan garis bujur dan waktu matahari',
      'Bentuk dan kesuburan lapisan tanah vulkanik'
    ],
    correctIndex: 1,
    explanation: 'Keterbukaan atau keengganan suatu masyarakat terhadap perubahan (modernisasi/budaya luar) memengaruhi keberagaman pola hidup masyarakat di Indonesia.',
    difficulty: 'sedang',
    hint: 'Masyarakat ada yang terbuka cepat menerima hal baru, ada yang membatasi perubahan.',
  },
  {
    id: 'q24',
    topic: 'budaya',
    topicLabel: 'Kekayaan Budaya Nusantara',
    question: 'Rumah adat Lamin (Betang) di Kalimantan berukuran sangat panjang dan dihuni oleh puluhan keluarga suku Dayak. Nilai luhur utama yang tercermin dari arsitektur ini adalah...',
    options: [
      'Kekuasaan mutlak kepala suku',
      'Kebersamaan, gotong royong, dan kesetaraan',
      'Persaingan antar keluarga penghuni',
      'Keinginan menghemat biaya tanah bangunan'
    ],
    correctIndex: 1,
    explanation: 'Rumah Betang melambangkan kehidupan komunal suku Dayak yang mengutamakan musyawarah mufakat, saling tolong menolong, dan kerukunan bersama.',
    difficulty: 'sedang',
    hint: 'Tinggal bersama di bawah satu atap besar mengajarkan...',
  },
];
