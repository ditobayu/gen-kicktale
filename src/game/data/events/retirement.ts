import type { StoryEvent } from '../../types/game';

export const retirementEvents: StoryEvent[] = [
  {
    id: 'retirement_adapt', chapter: 'retirement', minAge: 30, maxAge: 38, weight: 11,
    title: 'Satu langkah lebih awal', scene: 'training', action: 'pass',
    description: 'Lari pertama masih terasa akrab; lari kelima meminta waktu lebih lama untuk pulih. Dalam rekaman, kamu melihat bahwa pemain muda tiba lebih cepat, tetapi belum tentu tahu ke mana harus pergi. Coach Ratih bertanya bagian permainan mana yang ingin kamu bawa lebih jauh.',
    choices: [
      { id: 'adapt_read', label: 'Menang lewat posisi dan keputusan', hint: 'Visi dan kondisi · kecepatan serta ketajaman berkurang', effects: { vision: 5, fitness: 3, pace: -3, technique: -1 }, flags: ['resilience'], outcome: 'Kamu bergerak lebih awal, meminta bola di tempat yang lebih tepat, dan menghemat beberapa meter yang dulu selalu dikejar. Pengalaman mulai terasa sebagai alat, bukan sekadar kenangan.' },
      { id: 'adapt_speed', label: 'Pertahankan daya ledak lewat latihan khusus', hint: 'Kecepatan dan keyakinan · beban serta risiko meningkat', effects: { pace: 4, mentality: 3, fitness: -4, injuryRisk: 5 }, flags: ['riskTaker'], injury: 'risk', action: 'dribble', outcome: 'Latihan khusus memberimu kembali sebagian letupan yang dirindukan. Kamu masih bisa mengejutkan lawan, tetapi sekarang harus lebih cermat memilih kapan menyalakan tenaga itu.' },
    ],
  },
  {
    id: 'retirement_mentor', chapter: 'retirement', minAge: 30, maxAge: 38, weight: 10,
    title: 'Suara yang dulu kamu butuhkan', scene: 'locker', action: 'training',
    description: 'Seorang pemain muda duduk terlalu lama setelah melakukan kesalahan. Kamu mengenali cara ia menatap sepatu, persis seperti orang yang berharap lantai bisa menelannya. Ada jadwal pengembangan pribadimu sebentar lagi, tetapi tidak semua bantuan tercatat dalam program latihan.',
    callback: { flag: 'mentor', text: 'Coach Ratih pernah menyediakan waktu semacam ini untukmu. Kamu masih ingat bahwa satu percakapan yang tepat bisa mengubah cara seseorang pulang dari lapangan.' },
    choices: [
      { id: 'mentor_listen', label: 'Duduk, dengarkan, lalu bantu ia belajar', hint: 'Kepelatihan dan kepercayaan · pengembangan pribadi terpotong', effects: { trust: 4, vision: 3, technique: -3, fitness: -1 }, flags: ['coaching', 'mentor'], coaching: 5, outcome: 'Kamu membiarkan ia bercerita sampai selesai sebelum memberi petunjuk. Esoknya ia meminta bola lagi; kemajuan kecil itu terasa seperti sesuatu yang ingin kamu kerjakan lebih lama.' },
      { id: 'mentor_example', label: 'Ajak ia melihat program latihanmu', hint: 'Disiplin dan teknik · pendampingan lebih terbatas', effects: { discipline: 4, technique: 2, morale: -2, fitness: -2 }, flags: ['disciplined'], coaching: 1, outcome: 'Kamu menunjukkan bagaimana mengulang satu gerakan tanpa menjadikan kesalahan sebagai identitas. Ia mendapat contoh yang berguna, sementara pekerjaan pribadimu tetap bergerak.' },
    ],
  },
  {
    id: 'retirement_crossroads', chapter: 'retirement', minAge: 33, maxAge: 33, weight: 100,
    title: 'Tiga jalan setelah tiga puluh tiga', scene: 'office', action: 'contract',
    description: 'Pada usia tiga puluh tiga, Nara menjelaskan jalur yang sesuai dengan minat klub terhadapmu. Klub saat ini membicarakan peran yang lebih terbatas, sementara rute pulang atau mencoba lingkungan luar negeri bisa dipertimbangkan sesuai kesempatan yang tersedia. Kali ini pertanyaannya bukan hanya di mana kamu bisa bermain, tetapi kehidupan seperti apa yang ingin kamu bangun.',
    callback: { flag: 'homeRoots', text: 'Ibu dan Bima tidak pernah berhenti menyisakan tempat untukmu. Jalan pulang terasa lebih nyata karena hubungan itu kamu rawat jauh sebelum karier memasuki babak akhir.' },
    choices: [
      { id: 'crossroads_stay', label: 'Bertahan dan jadi penopang skuad', hint: 'Kesetiaan dan kepercayaan · terima menit yang lebih sedikit', effects: { trust: 6, vision: 2, playingTime: -6, money: -2000000 }, transfer: 'loyal', flags: ['loyalty', 'mentor'], coaching: 2, outcome: 'Kamu menerima bahwa membantu tim tidak selalu berarti masuk paling awal. Orang-orang mengenalmu lebih dalam daripada angka kontrak, dan kamu memilih memperpanjang percakapan itu.' },
      { id: 'crossroads_home', label: 'Utamakan rute pulang dan peran memimpin', hint: 'Keluarga dan tanggung jawab · pendapatan serta sorotan turun', effects: { family: 6, morale: 4, money: -4000000, reputation: -3 }, transfer: 'home', flags: ['homeRoots', 'captain'], outcome: 'Nara menindaklanjuti jalur pulang yang memungkinkan. Kamu membayangkan latihan yang selesai dekat rumah dan tanggung jawab membimbing pemain lain; ambisimu kini punya jarak yang berbeda.' },
      { id: 'crossroads_abroad', label: 'Cari satu petualangan di luar negeri', hint: 'Pengalaman dan pendapatan · adaptasi serta jarak keluarga', effects: { money: 5000000, mentality: 3, family: -5, trust: -3 }, transfer: 'abroad', flags: ['journeyman', 'moneyFirst'], outcome: 'Kamu membuka diri pada pembicaraan luar negeri yang cocok dengan kemampuan dan minat klub. Koper lama dikeluarkan lagi; pengalaman tidak menghapus gugup saat memulai di tempat baru.' },
    ],
  },
  {
    id: 'retirement_recovery', chapter: 'retirement', minAge: 30, maxAge: 38, weight: 15,
    title: 'Kesabaran yang lebih mahal', scene: 'medical', action: 'injury', conditions: { injured: true },
    description: 'Proses pemulihan sekarang meminta waktu dan perhatian lebih banyak. Kamu memandangi sepatu latihan sambil menghitung kesempatan yang mungkin masih tersisa. Petugas medis menjelaskan bahwa kalender karier dan kalender tubuh kadang menulis tanggal yang berbeda.',
    choices: [
      { id: 'veteran_rehab', label: 'Tuntaskan pemulihan, terima peran berubah', hint: 'Kondisi dan ketangguhan · kecepatan serta menit berkurang', effects: { fitness: 5, mentality: 3, pace: -3, playingTime: -5, injuryRisk: -6 }, flags: ['comeback', 'resilience'], injury: 'recover', outcome: 'Kamu menyusun sasaran yang bisa dicapai tanpa berbohong pada tubuh. Kembali ke rumput tetap terasa besar, meski jalan menuju sana kini lebih pelan dan lebih sadar.' },
      { id: 'veteran_risk', label: 'Dorong kesempatan kembali secepatnya', hint: 'Semangat dan menit · risiko kambuh serta kondisi tertekan', effects: { morale: 4, playingTime: 4, fitness: -5, injuryRisk: 6 }, flags: ['neglect', 'riskTaker'], injury: 'risk', action: 'training', outcome: 'Kamu memperjuangkan hari tambahan di lapangan, dengan tubuh yang belum selesai bernegosiasi. Keinginan itu bisa dimengerti, tetapi setiap sesi kini meminta keputusan ulang yang jujur.' },
    ],
  },
  {
    id: 'retirement_coach_course', chapter: 'retirement', minAge: 30, maxAge: 38, weight: 11,
    title: 'Kembali duduk sebagai murid', scene: 'academy', action: 'training',
    description: 'Coach Ratih mengirim informasi kursus dasar kepelatihan dengan catatan: “Banyak pengalaman belum tentu otomatis mudah dijelaskan.” Kelasnya menyita waktu bebas dan sebagian tabungan, sementara tim masih membutuhkan persiapanmu sebagai pemain. Ada masa depan yang bisa dipelajari sebelum benar-benar diperlukan.',
    callback: { flag: 'coaching', text: 'Kamu sudah pernah merasakan kepuasan membantu pemain lain berkembang. Kursus ini memberi bahasa dan struktur bagi sesuatu yang selama ini dilakukan lewat naluri.' },
    choices: [
      { id: 'course_enroll', label: 'Daftar kursus dan susun rencana latihan', hint: 'Kepelatihan dan visi · biaya serta persiapan fisik berkurang', effects: { vision: 4, discipline: 3, money: -4000000, fitness: -3 }, flags: ['coaching'], coaching: 6, outcome: 'Kamu mulai membuat sesi yang punya tujuan, bukan hanya mengulang latihan favorit. Saat peserta lain mengkritik rencanamu, kamu kembali belajar menerima koreksi seperti anak di Cakrawala Junior.' },
      { id: 'course_player', label: 'Tunda kursus dan jaga fokus sebagai pemain', hint: 'Kondisi dan menit · rencana kepelatihan berjalan lambat', effects: { fitness: 4, playingTime: 3, morale: -2, vision: -2 }, flags: ['disciplined'], outcome: 'Kamu menyimpan formulir dan memilih menuntaskan pekerjaan yang masih berjalan. Masa depan tetap menunggu di laci, tetapi jadwal pekan ini mendapat perhatian penuh.' },
    ],
  },
  {
    id: 'retirement_family', chapter: 'retirement', minAge: 30, maxAge: 38, weight: 9,
    title: 'Makan malam tanpa menghitung waktu', scene: 'street', action: 'pass',
    description: 'Ibu menyiapkan makanan favoritmu dan bilang tidak ada acara khusus. Justru itu yang membuat undangannya terasa penting: hidup sudah terlalu lama menunggu jeda dari jadwal pertandingan. Di saat bersamaan, klub menawarkan sesi persiapan tambahan yang bisa membantu mempertahankan peranmu.',
    choices: [
      { id: 'family_evening', label: 'Pulang dan hadir sepenuhnya', hint: 'Keluarga dan semangat · menit serta kepercayaan sedikit turun', effects: { family: 6, morale: 4, playingTime: -3, trust: -2 }, flags: ['homeRoots'], outcome: 'Kamu meletakkan ponsel di meja jauh dari piring. Percakapan berpindah dari bola ke hal-hal kecil; untuk pertama kali setelah lama, tidak ada yang perlu buru-buru menutup malam.' },
      { id: 'family_training', label: 'Ikut persiapan, atur hari pengganti', hint: 'Kepercayaan dan kebugaran · hubungan menanggung penundaan lagi', effects: { trust: 4, fitness: 3, family: -4, morale: -2 }, flags: ['disciplined'], action: 'training', outcome: 'Kamu mengerjakan sesi dengan serius dan menetapkan tanggal pulang yang nyata. Ibu mengatakan akan menunggu, seperti sudah sering ia lakukan; kalimat itu kini terdengar lebih berat.' },
    ],
  },
  {
    id: 'retirement_role', chapter: 'retirement', minAge: 30, maxAge: 38, weight: 10,
    title: 'Rompi utama untuk orang lain', scene: 'locker', action: 'bench',
    description: 'Pemain yang lebih muda mendapat peran yang dulu sering diberikan kepadamu. Pelatih meminta pendapatmu tentang cara membantunya tanpa mematikan persaingan yang sehat. Kamu masih ingin bermain, sekaligus tahu persis betapa menakutkan rompi utama bagi orang yang baru menerimanya.',
    choices: [
      { id: 'role_support', label: 'Bantu ia siap, lalu maksimalkan menitku', hint: 'Kepelatihan dan kepercayaan · menit serta reputasi berkurang', effects: { trust: 5, vision: 3, playingTime: -5, reputation: -2 }, flags: ['coaching', 'mentor'], coaching: 4, outcome: 'Kamu memberinya catatan yang dulu ingin kamu miliki. Ketika kesempatanmu datang, tim sudah lebih rapi; kamu mulai melihat bahwa kontribusi bisa berlanjut setelah peluit pergantian.' },
      { id: 'role_compete', label: 'Tunjukkan bahwa aku masih layak memulai', hint: 'Mentalitas diuji · menit bisa kembali, ketegangan bisa bertambah', effects: { fitness: -3, injuryRisk: 2 }, skill: 'mentality', difficulty: 61, successEffects: { playingTime: 5, reputation: 3 }, failureEffects: { trust: -3, morale: -3 }, flags: ['riskTaker'], action: 'tackle', outcome: 'Kamu menjawab dengan intensitas yang terukur dan keputusan yang matang. Pelatih memasukkan namamu kembali dalam perhitungan; pengalaman masih punya cara bersuara.', failure: 'Keinginan membuktikan diri membuatmu memaksa terlalu banyak. Pelatih mengajak bicara setelah sesi; harga dirimu perlu ditopang oleh permainan yang masih bisa diulang.' },
    ],
  },
  {
    id: 'retirement_last_offer', chapter: 'retirement', minAge: 30, maxAge: 38, weight: 9,
    title: 'Angka terakhir di meja Nara', scene: 'office', action: 'contract',
    description: 'Ada pembicaraan kontrak baru yang disesuaikan dengan reputasi dan kondisi terkinimu. Nara membuka kemungkinan pendapatan lebih tinggi lewat lingkungan baru, atau kestabilan dari kesepakatan yang lebih sederhana. Setelah bertahun-tahun bepergian, biaya sebuah kepindahan tidak lagi cukup dihitung dari ongkos tiket.',
    callback: { flag: 'moneyFirst', text: 'Kamu tahu uang yang dikumpulkan bisa membuat keluarga lebih aman. Kamu juga tahu beberapa kesempatan sebelumnya telah mengambil waktu yang tidak dapat dibeli kembali.' },
    choices: [
      { id: 'offer_money', label: 'Cari kontrak luar negeri yang paling masuk akal', hint: 'Pendapatan dan pengalaman · keluarga serta kestabilan menurun', effects: { money: 6000000, mentality: 2, family: -5, trust: -3 }, transfer: 'abroad', flags: ['moneyFirst', 'journeyman'], outcome: 'Nara menyaring tawaran luar negeri yang benar-benar cocok. Kamu memilih kemungkinan baru sambil menyusun cara menjaga hubungan dari kejauhan; pengalaman membuatmu lebih siap, bukan kebal terhadap rindu.' },
      { id: 'offer_stable', label: 'Pilih kestabilan bersama klub saat ini', hint: 'Kepercayaan dan kondisi · pendapatan tambahan terlewat', effects: { trust: 5, fitness: 2, money: -4000000, morale: -1 }, transfer: 'loyal', flags: ['loyalty'], outcome: 'Kamu meminta peran dan batas beban yang jelas, lalu menjaga rumah kariermu tetap di sini. Ada ketenangan dalam nama-nama yang sudah kamu hafal setiap kali memasuki ruang ganti.' },
    ],
  },
  {
    id: 'retirement_old_ball', chapter: 'retirement', minAge: 30, maxAge: 38, weight: 9,
    title: 'Bola yang jahitannya terbuka', scene: 'street', action: 'dribble',
    description: 'Bima menemukan bola lama di gudang Cakrawala Junior, lengkap dengan bekas tambalan yang kalian bantah siapa pembuatnya. Ia mengusulkan kegiatan kecil untuk anak-anak setempat, sementara kamu sedang menyusun jadwal tersisa. Bola itu tidak layak dipakai bertanding, tetapi masih bisa memulai percakapan.',
    choices: [
      { id: 'old_ball_school', label: 'Bantu Bima menyusun latihan anak-anak', hint: 'Akar pulang dan kepelatihan · waktu fisik serta tabungan terpakai', effects: { family: 4, vision: 3, money: -3000000, fitness: -2 }, flags: ['coaching', 'homeRoots', 'friendship'], coaching: 5, action: 'pass', outcome: 'Kalian menyusun permainan sederhana agar semua anak menyentuh bola. Kamu pulang membawa rencana mingguan, dan Bima membawa alasan baru untuk terus merawat lapangan.' },
      { id: 'old_ball_memory', label: 'Simpan bolanya, bantu perlengkapan dulu', hint: 'Semangat dan kondisi · uang terpakai, rencana melatih tertunda', effects: { morale: 5, fitness: 2, money: -4000000, vision: -1 }, flags: ['homeRoots', 'friendship'], outcome: 'Kamu membantu pengadaan peralatan lalu membawa pulang bola tua itu. Benda ringan itu memuat perjalanan yang panjang; untuk sekarang, kamu ingin menuntaskan bagianmu sebagai pemain lebih dulu.' },
    ],
  },
  {
    id: 'retirement_farewell', chapter: 'retirement', minAge: 38, maxAge: 38, weight: 100,
    title: 'Peluit yang akhirnya untuk pulang', scene: 'stadium', action: 'farewell',
    description: 'Usia tiga puluh delapan. Sepatumu diletakkan di samping garis untuk satu hari perpisahan, dan wajah-wajah yang menemani perjalananmu terasa lebih jelas daripada papan skor. Bima, Raka, Coach Ratih, Ibu, dan Nara masing-masing menyimpan versi berbeda tentang dirimu; sekarang kamu memilih kalimat pertama untuk bab berikutnya.',
    callback: { flag: 'comeback', text: 'Ada masa ketika kembali berdiri di lapangan saja terasa mustahil. Kamu membawa ingatan itu ke garis samping, bersama rasa hormat yang baru terhadap tubuh dan waktu.' },
    choices: [
      { id: 'farewell_coach', label: 'Gantung sepatu, mulai membimbing', hint: 'Bekal kepelatihan · tabungan dan waktu bebas dikorbankan', effects: { vision: 3, morale: 3, money: -4000000, family: -2 }, flags: ['coaching'], coaching: 5, outcome: 'Kamu melepas sepatu lalu mengambil buku catatan. Pengalaman belum menjadikanmu pelatih hebat secara otomatis, tetapi kini ada pekerjaan baru yang ingin kamu pelajari dengan sungguh-sungguh.' },
      { id: 'farewell_home', label: 'Pulang dan rawat hal-hal yang menunggu', hint: 'Keluarga serta semangat · pendapatan dan sorotan mereda', effects: { family: 6, morale: 5, money: -2000000, reputation: -2 }, flags: ['homeRoots'], outcome: 'Kamu melambaikan tangan lalu mencari Ibu dan Bima. Sepak bola tetap menjadi bagian hidupmu, bersama pagi yang tidak lagi diukur dengan jam berangkat latihan.' },
      { id: 'farewell_open', label: 'Buka pintu untuk pengalaman baru', hint: 'Keyakinan dan kebebasan · masa depan belum punya kestabilan', effects: { mentality: 4, morale: 4, family: -2, money: -2000000 }, flags: ['journeyman'], outcome: 'Kamu mengucapkan terima kasih tanpa mencoba merangkum semuanya dalam satu kalimat. Ada nama, tempat, dan pelajaran yang cukup untuk perjalanan lain; kali ini kamu boleh belum tahu arahnya.' },
    ],
  },
];
