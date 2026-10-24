import type { StoryEvent } from '../../types/game';

export const childhoodEvents: StoryEvent[] = [
  {
    id: 'childhood_first', chapter: 'childhood', minAge: 8, maxAge: 8, weight: 100,
    title: 'Bola pertama, mimpi pertama', scene: 'street', action: 'shoot',
    description: 'Surabaya, usia delapan tahun. Di lapangan berdebu Cakrawala Junior, Bima mengirim umpan yang memantul nakal di depan sepatumu. Gawang dari dua tas sekolah menunggu; dari pinggir lapangan, Coach Ratih berseru, “Lihat dulu, lalu putuskan!”',
    choices: [
      { id: 'first_shot', label: 'Sambut umpannya dengan tembakan', hint: 'Teknik diuji · berani tampil, sedikit kehilangan kontrol', effects: { mentality: 3, vision: -2 }, skill: 'technique', difficulty: 43, successEffects: { technique: 4, morale: 3 }, failureEffects: { technique: 2, morale: -2 }, flags: ['riskTaker'], action: 'shoot', outcome: 'TUK! Bola melewati dua tas sekolah. Bima melompat seolah kalian baru menjuarai dunia; Coach Ratih tersenyum melihat keberanianmu.', failure: 'Bola melesat ke samping dan nyaris menyenggol botol minum. Bima tetap mengangkat dua jempol. “Sekali lagi, yuk!”' },
      { id: 'first_pass', label: 'Kontrol bola, lalu kembalikan ke Bima', hint: 'Visi dan pertemanan tumbuh · sorotanmu berkurang', effects: { vision: 4, technique: 2, mentality: -2, morale: 2 }, flags: ['friendship'], action: 'pass', outcome: 'Kamu meredam pantulan, mengembalikan bola ke Bima, lalu menerima umpan baliknya untuk tembakan pertama. Bola menyusup di antara tas. “Bisa juga bikin gol bareng-bareng,” kata Coach Ratih.' },
    ],
  },
  {
    id: 'childhood_new_boots', chapter: 'childhood', minAge: 8, maxAge: 12, weight: 9,
    title: 'Sepatu dari celengan', scene: 'street', action: 'training',
    description: 'Sol sepatumu mulai menganga seperti ikan yang minta makan. Ibu menghitung isi celengan sambil bilang kalian bisa membeli sepatu baru, tetapi uang untuk perjalanan turnamen harus menunggu. Bima menawarkan sepatunya yang sedikit kebesaran.',
    choices: [
      { id: 'borrow_boots', label: 'Pinjam sepatu Bima untuk turnamen', hint: 'Peluang bermain dan teman bertambah · perlu beradaptasi', effects: { playingTime: 5, vision: 2, technique: -2, family: 2 }, flags: ['friendship', 'homeRoots'], outcome: 'Kamu mengikat tali sepatu dua kali supaya tidak lepas. Sepatunya memang longgar, tetapi perjalanan bersama tim menjadi cerita yang kalian ulang selama berbulan-bulan.' },
      { id: 'buy_boots', label: 'Pilih sepatu yang pas, lewatkan turnamen', hint: 'Teknik dan dukungan keluarga · kesempatan tampil berkurang', effects: { technique: 4, fitness: 2, playingTime: -4, family: 3 }, flags: ['disciplined'], outcome: 'Sepatu baru menempel pas di kaki. Saat teman-teman berangkat, kamu berlatih menerima bola dengan Coach Ratih; rasa iri ada, begitu juga sentuhan yang makin halus.' },
    ],
  },
  {
    id: 'childhood_rain', chapter: 'childhood', minAge: 8, maxAge: 12, weight: 10,
    title: 'Hujan dan garis kapur', scene: 'training', action: 'dribble',
    description: 'Hujan sore menghapus separuh garis lapangan. Sebagian anak pulang, sementara Coach Ratih menyiapkan latihan kontrol di teras yang sempit. Bima menunjuk kubangan: “Lapangan kita sekarang punya danau!”',
    choices: [
      { id: 'rain_control', label: 'Ikut latihan kontrol di teras', hint: 'Teknik dan disiplin · sore terasa lebih melelahkan', effects: { technique: 5, discipline: 3, morale: -2, fitness: -2 }, flags: ['disciplined', 'mentor'], outcome: 'Kamu belajar menahan bola sebelum menyentuh tembok. Coach Ratih mengulang satu petunjuk: sentuhan kecil membuat ruang sempit terasa lebih lapang.' },
      { id: 'rain_home', label: 'Pulang dan ajak Bima main besok', hint: 'Pulih dan dekat keluarga · latihan hari ini terlewat', effects: { fitness: 4, morale: 3, family: 2, technique: -2 }, flags: ['friendship'], outcome: 'Ibu menyodorkan handuk sebelum kamu masuk rumah. Malamnya kamu menggambar lapangan versi sendiri di buku; besok Bima harus mencoba jalur baru itu.' },
    ],
  },
  {
    id: 'childhood_loss', chapter: 'childhood', minAge: 8, maxAge: 12, weight: 10,
    title: 'Kalah dengan lutut berdebu', scene: 'street', action: 'tackle',
    description: 'Tim kalian kalah dan Bima duduk menatap tanah. Kamu masih memikirkan satu bola yang gagal direbut, sementara anak-anak lain sudah mengajak bermain lagi. Coach Ratih membiarkan kalian merasakan kecewa sebentar.',
    choices: [
      { id: 'loss_review', label: 'Tanyakan cara membaca gerak lawan', hint: 'Visi dan ketangguhan · waktu bermain bebas berkurang', effects: { vision: 4, mentality: 3, morale: -2, mentor: 3 }, flags: ['resilience', 'mentor'], outcome: 'Coach Ratih menggambar jejak kaki di debu. Kamu menyadari tekel yang baik dimulai sebelum kaki bergerak; kekalahan sore ini membawa satu bekal baru.' },
      { id: 'loss_friend', label: 'Duduk bersama Bima, lalu mulai lagi', hint: 'Semangat dan persahabatan · evaluasi teknik tertunda', effects: { morale: 5, mentality: 2, vision: -2, family: 1 }, flags: ['friendship'], action: 'pass', outcome: 'Kalian sepakat gol berikutnya akan dirayakan dengan gaya paling konyol. Lima menit kemudian Bima sudah tertawa, dan lapangan terasa bisa ditaklukkan lagi.' },
    ],
  },
  {
    id: 'childhood_canteen', chapter: 'childhood', minAge: 8, maxAge: 12, weight: 8,
    title: 'Uang saku hari Sabtu', scene: 'street', action: 'training',
    description: 'Ada latihan pagi dan janji makan bersama teman setelahnya. Uang sakumu cukup untuk perjalanan tambahan atau berkumpul di warung langganan, jadi kamu harus mengatur akhir pekan. Ibu mengingatkan bahwa tubuh dibentuk kebiasaan, bukan satu piring jajanan.',
    choices: [
      { id: 'routine_extra', label: 'Pakai untuk datang ke sesi tambahan', hint: 'Kebugaran dan disiplin · rindu waktu bersama teman', effects: { fitness: 4, discipline: 3, morale: -3, technique: 2 }, flags: ['disciplined'], outcome: 'Kamu membawa bekal dari rumah dan menyelesaikan latihan pendek. Bukan keputusan yang meriah, tetapi rutinitas kecil mulai punya tempat di hidupmu.' },
      { id: 'routine_social', label: 'Cukup latihan utama, lalu kumpul', hint: 'Semangat dan hubungan · perkembangan fisik lebih lambat', effects: { morale: 5, fitness: 1, discipline: -2, family: 2 }, flags: ['friendship'], outcome: 'Latihan utama selesai, lalu cerita berhamburan di meja warung. Kamu pulang dengan hati ringan dan berjanji menjaga jadwal utama minggu depan.' },
    ],
  },
  {
    id: 'childhood_position', chapter: 'childhood', minAge: 8, maxAge: 12, weight: 9,
    title: 'Nomor di punggung', scene: 'training', action: 'pass',
    description: 'Coach Ratih membagikan rompi dan meminta semua anak mencoba tugas yang berbeda. Kamu ingin bermain di posisi kesukaanmu, tetapi ada ruang kosong yang perlu diisi agar permainan tetap jalan. Bima sudah mengacungkan tangan untuk menjadi kiper selama lima menit saja.',
    choices: [
      { id: 'position_specialist', label: 'Perdalam tugas di posisi pilihanku', hint: 'Teknik dan keyakinan · pemahaman tim berkembang lambat', effects: { technique: 5, mentality: 2, vision: -2, trust: -2 }, flags: ['riskTaker'], action: 'dribble', outcome: 'Kamu mengulangi gerakan yang sama sampai terasa lebih alami. Coach Ratih mengakui kemajuanmu, lalu mengingatkan bahwa bola tetap milik sebelas orang.' },
      { id: 'position_flexible', label: 'Isi ruang yang dibutuhkan tim', hint: 'Visi dan kepercayaan pelatih · waktu teknik khusus berkurang', effects: { vision: 4, trust: 4, technique: -2, playingTime: 2 }, flags: ['loyalty'], action: 'pass', outcome: 'Dari sudut lapangan yang berbeda, kamu melihat jalur umpan yang dulu luput. Coach Ratih mencatat namamu sebagai anak yang bisa diandalkan ketika rencana berubah.' },
    ],
  },
  {
    id: 'childhood_school', chapter: 'childhood', minAge: 8, maxAge: 12, weight: 8,
    title: 'PR di pinggir lapangan', scene: 'street', action: 'bench',
    description: 'Buku sekolah masih terbuka ketika Bima memanggil dari depan rumah. Besok ada tugas yang harus dikumpulkan dan latihan uji coba juga hanya berlangsung sore ini. Ibu menunggu kamu membuat pilihan, bukan menebaknya untukmu.',
    choices: [
      { id: 'school_first', label: 'Selesaikan tugas, datang sedikit terlambat', hint: 'Disiplin dan keluarga · menit latihan terpotong', effects: { discipline: 5, family: 4, playingTime: -4, morale: -1 }, flags: ['disciplined'], outcome: 'Coach Ratih meminta penjelasan lalu memberimu rompi cadangan. Kamu menonton dulu, melihat pola permainan, dan masuk dengan pikiran yang sudah lebih tenang.' },
      { id: 'training_first', label: 'Ikut uji coba, kerjakan tugas malam ini', hint: 'Pengalaman bermain · tubuh dan keluarga perlu perhatian', effects: { playingTime: 5, technique: 3, fitness: -3, family: -3 }, flags: ['riskTaker'], action: 'shoot', outcome: 'Kamu mendapat banyak sentuhan bola sore itu. Malam terasa panjang bersama buku tugas; Ibu menemani sambil mengingatkan bahwa jadwal seperti ini tidak bisa terus diulang.' },
    ],
  },
  {
    id: 'childhood_raka', chapter: 'childhood', minAge: 8, maxAge: 12, weight: 9,
    title: 'Anak baru bernama Raka', scene: 'training', action: 'dribble',
    description: 'Raka datang dengan tas rapi dan gerakan cepat yang membuat anak-anak berhenti bicara. Ia merebut bola darimu dua kali, lalu bertanya apakah kamu mau mencoba lagi. Nadanya menantang, tetapi ia juga tampak gugup menjadi anak baru.',
    choices: [
      { id: 'raka_duel', label: 'Tantang Raka satu lawan satu', hint: 'Kecepatan diuji · adu gengsi bisa menguras semangat', effects: { pace: 2, rival: 3, fitness: -2 }, skill: 'pace', difficulty: 45, successEffects: { mentality: 4, technique: 3 }, failureEffects: { mentality: -2, vision: 3 }, flags: ['riskTaker'], outcome: 'Kamu menemukan celah ketika Raka menumpukan berat badan. Setelah terlewati, ia mengangguk: mulai sekarang, latihan kalian tak akan sepi.', failure: 'Raka menutup jalurmu dengan bersih. Kamu kesal sebentar, lalu mulai memperhatikan langkah kakinya; ada sesuatu yang bisa dipelajari dari lawan sebaik ini.' },
      { id: 'raka_pair', label: 'Ajak Raka satu tim dengan Bima', hint: 'Visi dan hubungan · sorotan pribadi berkurang', effects: { vision: 4, rival: 5, mentality: -2, trust: 2 }, flags: ['friendship'], action: 'pass', outcome: 'Tiga operan pendek menghasilkan peluang pertama. Raka akhirnya tersenyum; Bima langsung menyebut kalian trio paling berisik di Cakrawala Junior.' },
    ],
  },
  {
    id: 'childhood_family_trip', chapter: 'childhood', minAge: 8, maxAge: 12, weight: 8,
    title: 'Hari Minggu yang berebut', scene: 'street', action: 'training',
    description: 'Keluarga merencanakan kunjungan ke rumah saudara tepat saat tim mendapat undangan latihan bersama. Ibu tidak melarangmu bermain, tetapi ia sudah lama ingin satu hari tanpa melihat jam. Kamu bisa merasakan dua hal yang sama-sama kamu sayangi menarik lenganmu.',
    choices: [
      { id: 'family_weekend', label: 'Ikut keluarga, bawa bola kecil', hint: 'Hubungan dan pemulihan · kesempatan dilihat pelatih terlewat', effects: { family: 5, morale: 3, fitness: 2, trust: -3 }, flags: ['homeRoots'], outcome: 'Di halaman rumah saudara, kamu mengajari sepupu menendang. Tidak ada pencatat skor, tetapi Ibu menyimpan foto sore itu lebih lama daripada jadwal pertandinganmu.' },
      { id: 'team_weekend', label: 'Ikut latihan bersama', hint: 'Kepercayaan dan teknik · kedekatan keluarga berkurang', effects: { trust: 4, technique: 3, family: -4, fitness: -1 }, flags: ['disciplined'], outcome: 'Latihan memberi lawan yang lebih tangguh dan pelajaran baru. Kamu menelepon Ibu sesudahnya; ia senang mendengar ceritamu, meski ada jeda kecil ketika membahas foto keluarga.' },
    ],
  },
  {
    id: 'childhood_small_captain', chapter: 'childhood', minAge: 8, maxAge: 12, weight: 8,
    title: 'Siapa membawa bola pulang?', scene: 'street', action: 'pass',
    description: 'Latihan selesai dan semua orang hendak lari pulang. Rompi berserakan, bola menggelinding ke selokan kering, dan Coach Ratih masih membantu anak yang terjatuh. Bima mengajakmu mengejar penjual es sebelum lewat tikungan.',
    choices: [
      { id: 'tidy_team', label: 'Ajak anak-anak merapikan peralatan', hint: 'Kepercayaan dan disiplin · kesenangan kecil terlewat', effects: { trust: 4, discipline: 3, mentality: 2, morale: -2 }, flags: ['captain'], outcome: 'Kamu membagi tugas singkat dan pekerjaan selesai cepat. Coach Ratih tidak berpidato; ia hanya melemparkan bola kepadamu lebih dulu pada latihan berikutnya.' },
      { id: 'chase_ice', label: 'Kejar Bima, kembali membantu setelahnya', hint: 'Semangat dan teman · kepercayaan pelatih sedikit turun', effects: { morale: 5, pace: 2, trust: -3, discipline: -2 }, flags: ['friendship'], action: 'dribble', outcome: 'Kalian berhasil mengejar penjual es, tetapi kembali ketika peralatan hampir beres. Coach Ratih mengangkat alis; kamu mengambil keranjang terakhir tanpa banyak alasan.' },
    ],
  },
];
