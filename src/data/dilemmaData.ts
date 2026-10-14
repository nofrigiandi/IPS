import { DilemmaScenario } from '../types/game';

export const DILEMMA_SCENARIOS: DilemmaScenario[] = [
  {
    id: 'sc1',
    title: 'Siswa Baru dari Ujung Timur',
    context: 'Di kelas 7-B, ada siswa pindahan baru bernama Edo yang berasal dari Papua. Saat memperkenalkan diri, logat bicara Edo terdengar berbeda dan ada beberapa teman yang tertawa kecil di barisan belakang.',
    situation: 'Saat pembagian kelompok tugas proyek IPS, tidak ada yang berinisiatif mengajak Edo bergabung karena khawatir gaya bicaranya berbeda dan sulit berkomunikasi.',
    character: 'Edo (Siswa Pindahan Baru)',
    choices: [
      {
        text: 'Langsung mengangkat tangan dan mengajak Edo masuk ke dalam kelompokmu dengan hangat, serta membantunya beradaptasi.',
        isBest: true,
        scoreChange: { tolerance: 20, harmony: 20, xp: 120 },
        feedback: 'Luar biasa! Kamu mencerminkan Pelajar Pancasila sejati. Keberagaman bahasa dan logat adalah kekayaan Indonesia, bukan bahan lelucon. Edo merasa dihargai dan kelompokmu mendapat perspektif baru.',
        nilaiKarakter: 'Inklusif & Menghargai Martabat Sesama',
      },
      {
        text: 'Diam saja menunggu guru yang membagikan kelompok agar tidak ikut dipandang aneh oleh teman lain.',
        isBest: false,
        scoreChange: { tolerance: 5, harmony: 5, xp: 30 },
        feedback: 'Sikap pasif memang tidak melukai langsung, namun membiarkan teman baru merasa terkucilkan mengurangi rasa solidaritas kebangsaan di kelas.',
        nilaiKarakter: 'Kurang Berani Mengambil Sikap',
      },
      {
        text: 'Menolak jika Edo masuk kelompokmu dengan alasan komunikasi akan lambat.',
        isBest: false,
        scoreChange: { tolerance: -15, harmony: -15, xp: 0 },
        feedback: 'Sikap ini merupakan bentuk prasangka stereotip etnis yang bertentangan dengan semboyan Bhinneka Tunggal Ika. Setiap siswa berhak mendapatkan perlakuan setara.',
        nilaiKarakter: 'Prasangka & Diskriminatif',
      },
    ],
  },
  {
    id: 'sc2',
    title: 'Musyawarah Pemilihan Ketua OSIS',
    context: 'Sekolah sedang mengadakan pemilihan Ketua OSIS. Kandidat nomor 1 bernama Bagas, memiliki program kerja yang sangat matang, berprestasi, dan jujur, namun agamanya berbeda dari mayoritas murid.',
    situation: 'Beberapa teman mengajakmu untuk tidak memilih Bagas hanya karena alasan agama, dan menyuruhmu memilih calon lain meski program kerjanya kurang jelas.',
    character: 'Bagas (Calon Ketua OSIS Berbakat)',
    choices: [
      {
        text: 'Menolak ajakan tersebut dengan santun dan tetap memilih Bagas berdasarkan kemampuan, integritas, dan program kerjanya yang nyata.',
        isBest: true,
        scoreChange: { tolerance: 25, harmony: 20, xp: 140 },
        feedback: 'Pilihan yang sangat bijak! Dalam kehidupan berbangsa dan berorganisasi, kita harus menjunjung asas meritokrasi dan objektivitas, bukan primordialisme sempit.',
        nilaiKarakter: 'Anti Primordialisme & Adil',
      },
      {
        text: 'Ikut-ikutan ajakan teman agar tidak dijauhi oleh pergaulan geng sekolah.',
        isBest: false,
        scoreChange: { tolerance: -10, harmony: -10, xp: 10 },
        feedback: 'Memilih pemimpin hanya berdasarkan kesamaan suku atau agama (primordialisme) merugikan kemajuan organisasi sekolah.',
        nilaiKarakter: 'Konformitas Negatif',
      },
      {
        text: 'Memutuskan golput / tidak memilih sama sekali agar tidak pusing.',
        isBest: false,
        scoreChange: { tolerance: 0, harmony: 5, xp: 20 },
        feedback: 'Golput melepaskan hak demokratismu sebagai warga sekolah yang bertanggung jawab.',
        nilaiKarakter: 'Apatis Terhadap Kemajuan Bersama',
      },
    ],
  },
  {
    id: 'sc3',
    title: 'Waktu Istirahat di Bulan Puasa',
    context: 'Saat bulan Ramadan, sebagian besar temanmu di kelas 7 sedang menjalankan ibadah puasa. Jam istirahat pertama tiba, perutmu terasa lapar.',
    situation: 'Kamu tidak berpuasa karena berbeda keyakinan, dan kamu membawa bekal makanan serta minuman dingin dari rumah.',
    character: 'Rekan-rekan Sekelas yang Berpuasa',
    choices: [
      {
        text: 'Makan dan minum bekalmu di area kantin atau tempat khusus dengan sopan tanpa sengaja menciumkan aroma makanan di depan teman yang puasa.',
        isBest: true,
        scoreChange: { tolerance: 20, harmony: 20, xp: 110 },
        feedback: 'Sikap tenggang rasa yang jempolan! Menghargai orang lain yang beribadah tanpa mengorbankan kebutuhan dirimu sendiri adalah intisari toleransi praktis.',
        nilaiKarakter: 'Tenggang Rasa (Tepo Seliro)',
      },
      {
        text: 'Membuka bekal dan makan sambil bercanda di depan teman yang berpuasa, lalu berkata "Wah minumannya segar sekali lho!".',
        isBest: false,
        scoreChange: { tolerance: -20, harmony: -15, xp: 0 },
        feedback: 'Perilaku ini tidak sensitif dan mengganggu kenyamanan teman sekelas yang sedang beribadah.',
        nilaiKarakter: 'Kurang Empati & Provokatif',
      },
      {
        text: 'Menahan lapar seharian penuh sampai pingsan karena takut dianggap tidak toleran.',
        isBest: false,
        scoreChange: { tolerance: 5, harmony: -5, xp: 30 },
        feedback: 'Toleransi bukan berarti menyiksa diri sendiri. Kamu tetap berhak makan dan minum di tempat yang semestinya.',
        nilaiKarakter: 'Keliru Memahami Toleransi',
      },
    ],
  },
  {
    id: 'sc4',
    title: 'Menyikapi Ujaran Kebencian di Grup WhatsApp',
    context: 'Di grup obrolan kelas, seorang siswa mengirim meme yang mengejek bentuk fisik dan adat upacara salah satu suku daerah lain di Indonesia.',
    situation: 'Beberapa anak membalas dengan emoji tertawa, sementara siswa yang berasal dari suku tersebut terdiam dan keluar dari grup obrolan.',
    character: 'Dina (Teman yang Tersinggung)',
    choices: [
      {
        text: 'Menegur pengirim meme dengan sopan tapi tegas di grup bahwa mengejek suku itu salah, lalu mengirim pesan pribadi (japri) menyemangati Dina.',
        isBest: true,
        scoreChange: { tolerance: 25, harmony: 25, xp: 150 },
        feedback: 'Tindakan berani dan bermartabat! Kamu berani menghentikan cyberbullying bermuatan SARA sekaligus memberi dukungan moral kepada korban.',
        nilaiKarakter: 'Keberanian Moral & Pembela Keadilan',
      },
      {
        text: 'Hanya melihat tanpa komentar apa pun karena takut dimusuhi anak yang mengirim meme.',
        isBest: false,
        scoreChange: { tolerance: 0, harmony: 0, xp: 20 },
        feedback: 'Bystander effect (hanya menonton ketidakadilan) sering kali membuat pelaku ujaran kebencian merasa tindakannya wajar.',
        nilaiKarakter: 'Bystander / Pasif',
      },
      {
        text: 'Ikut membalas dengan stiker tertawa agar terlihat gaul.',
        isBest: false,
        scoreChange: { tolerance: -25, harmony: -20, xp: 0 },
        feedback: 'Mendukung lelucon berbau SARA dapat merusak kerukunan dan termasuk pelanggaran etika bermedia sosial.',
        nilaiKarakter: 'Ikut Menyebarkan Kebencian',
      },
    ],
  },
];
