import type { StoryEvent } from '../../types/game';

export const primeEvents: StoryEvent[] = [
  {
    id: 'prime_transfer', chapter: 'prime', minAge: 23, maxAge: 29, weight: 11,
    title: 'Harga dari sebuah langkah', scene: 'office', action: 'contract',
    description: 'Nara membawa kabar minat klub berdasarkan penampilanmu sejauh ini. Jalur yang paling ambisius juga membawa persaingan dan tuntutan baru; bertahan berarti melanjutkan pekerjaan yang sudah dipahami orang-orang di klub. Di luar jendela, anak-anak masih bermain seolah jendela transfer tidak pernah diciptakan.',
    callback: { flag: 'loyalty', text: 'Kamu pernah memilih bertahan ketika jalan lain terbuka. Kali ini Nara mengingatkan bahwa kesetiaanmu punya arti karena benar-benar ada pilihan untuk pergi.' },
    choices: [
      { id: 'prime_ambition', label: 'Kejar langkah tertinggi yang realistis', hint: 'Peluang prestise dan uang · menit serta rasa aman menurun', effects: { reputation: 4, money: 5000000, playingTime: -5, morale: -3 }, transfer: 'ambition', flags: ['ambition'], outcome: 'Nara membuka pembicaraan pada tingkat yang bersedia menerima tantanganmu. Kamu memilih ruang yang lebih sulit, lalu menyiapkan diri untuk merebut tempat di dalamnya.' },
      { id: 'prime_loyal', label: 'Bangun sesuatu lebih lama di sini', hint: 'Kepercayaan dan kedekatan · pendapatan tambahan terlewat', effects: { trust: 6, morale: 3, money: -4000000, reputation: -2 }, transfer: 'loyal', flags: ['loyalty'], outcome: 'Kamu meminta proyek olahraga yang jelas sebelum menyatakan bertahan. Orang-orang klub menyambut keputusanmu, dan harapan mereka kini terasa lebih dekat, sekaligus lebih berat.' },
      { id: 'prime_minutes', label: 'Pilih proyek dengan peran lebih besar', hint: 'Menit dan kendali · fasilitas serta sorotan bisa mengecil', effects: { playingTime: 6, mentality: 2, reputation: -3, money: -3000000 }, transfer: 'minutes', flags: ['minutesFirst'], outcome: 'Kamu menjadikan peran di lapangan pusat negosiasi. Ada ambisi yang diukur lewat nama di pintu, ada pula yang diukur lewat tanggung jawab setiap pekan; kamu memilih yang kedua.' },
    ],
  },
  {
    id: 'prime_captain', chapter: 'prime', minAge: 23, maxAge: 29, weight: 10,
    title: 'Ban yang terasa berat', scene: 'locker', action: 'pass',
    description: 'Pelatih memintamu membantu memimpin sesi ketika beberapa pemain senior absen. Dua rekan mulai berdebat tentang pembagian tugas, dan semua orang seolah menunggu siapa yang akan bicara lebih dulu. Ban latihan itu ringan di tangan, tetapi tanggung jawabnya tidak.',
    choices: [
      { id: 'captain_listen', label: 'Dengarkan keduanya, satukan tugas tim', hint: 'Kepercayaan dan visi · fokus latihan pribadi berkurang', effects: { trust: 5, vision: 3, technique: -3, fitness: -1 }, flags: ['captain'], coaching: 2, outcome: 'Kamu meminta mereka menjelaskan apa yang dibutuhkan, lalu membagi tugas yang saling membantu. Sesi kembali bergerak; kepemimpinanmu mulai terlihat dalam permainan orang lain.' },
      { id: 'captain_example', label: 'Pimpin lewat intensitas permainanmu', hint: 'Mentalitas diuji · tim bisa terangkat atau makin tegang', effects: { fitness: -3, injuryRisk: 2 }, skill: 'mentality', difficulty: 59, successEffects: { trust: 5, mentality: 3, reputation: 2 }, failureEffects: { trust: -3, morale: -3 }, flags: ['riskTaker'], action: 'tackle', outcome: 'Kamu memenangi duel, membantu rekan berdiri, lalu meminta tim bergerak bersama. Intensitasmu menular dan pertengkaran berubah menjadi tenaga.', failure: 'Tekananmu terasa seperti kemarahan bagi beberapa rekan. Latihan makin keras tanpa menjadi lebih rapi; setelahnya kamu perlu memperbaiki nada sebelum memperbaiki bentuk tim.' },
    ],
  },
  {
    id: 'prime_schedule', chapter: 'prime', minAge: 23, maxAge: 29, weight: 10,
    title: 'Tiga pertandingan, satu tubuh', scene: 'medical', action: 'injury',
    description: 'Jadwal berlapis membuat sesi pemulihan terasa seperti bagian dari pertandingan. Staf medis menawarkan pengurangan beban, sementara pelatih menginginkan skuad yang siap untuk rangkaian laga berikutnya. Kamu tahu tempatmu berharga, tetapi tubuh tidak mengenal klasemen.',
    callback: { flag: 'neglect', text: 'Ada beberapa peringatan tubuh yang pernah kamu abaikan. Kali ini staf medis menunjukkan catatannya dengan jelas, agar keputusanmu punya informasi yang lebih baik.' },
    choices: [
      { id: 'schedule_rotate', label: 'Terima rotasi dan jaga kondisi', hint: 'Kebugaran dan risiko membaik · menit serta sorotan turun', effects: { fitness: 5, injuryRisk: -6, playingTime: -5, reputation: -2 }, flags: ['disciplined'], injury: 'recover', outcome: 'Menonton sebagian laga dari bangku membuatmu gelisah. Namun kamu kembali berlatih dengan langkah yang lebih ringan, dan pertandingan berikutnya tidak lagi terasa seperti utang pada tubuh.' },
      { id: 'schedule_all', label: 'Minta terlibat di seluruh rangkaian', hint: 'Menit dan kepercayaan · beban serta risiko cedera meningkat', effects: { playingTime: 6, trust: 3, fitness: -5, injuryRisk: 6 }, flags: ['neglect', 'riskTaker'], injury: 'risk', action: 'training', outcome: 'Pelatih menghargai kesediaanmu dan menyiapkan peran lebih besar. Kamu mendapatkan lapangan yang diminta, bersama tanggung jawab untuk memperhatikan batas yang makin dekat.' },
    ],
  },
  {
    id: 'prime_style', chapter: 'prime', minAge: 23, maxAge: 29, weight: 10,
    title: 'Menang dengan cara lain', scene: 'training', action: 'dribble',
    description: 'Lawan mulai mengenal gerakan favoritmu. Video pertandingan memperlihatkan mereka menunggu sentuhan yang dahulu selalu berhasil, lalu menutup ruang sebelum kamu tiba. Coach Ratih menawarkan satu kalimat: “Kalau mereka sudah hafal, beri mereka pertanyaan baru.”',
    choices: [
      { id: 'style_new', label: 'Bangun variasi teknik yang lebih berani', hint: 'Teknik dan kecepatan · konsistensi serta kondisi tertekan', effects: { technique: 5, pace: 2, trust: -3, fitness: -3 }, flags: ['riskTaker'], outcome: 'Gerakan baru belum selalu bersih, tetapi lawan kini harus menunggu lebih lama sebelum memilih arah. Kamu menerima beberapa kesalahan sebagai biaya memperluas permainan.' },
      { id: 'style_read', label: 'Kurangi sentuhan, baca ruang lebih awal', hint: 'Visi dan kebugaran · daya ledak pribadi berkembang lambat', effects: { vision: 5, fitness: 2, pace: -2, mentality: -1 }, flags: ['disciplined'], action: 'pass', outcome: 'Kamu membiarkan bola melakukan sebagian pekerjaan. Satu sentuhan yang datang lebih cepat ternyata bisa mengalahkan beberapa langkah yang datang terlambat.' },
    ],
  },
  {
    id: 'prime_raka', chapter: 'prime', minAge: 23, maxAge: 29, weight: 9,
    title: 'Pesan dari pesaing lama', scene: 'training', action: 'tackle',
    description: 'Raka mengirim rekaman duel kalian dengan satu pesan: “Masih ingat gerakan ini?” Kalian punya waktu untuk sesi bersama di jeda latihan, atau kamu bisa menggunakan jeda itu untuk menjaga program sendiri. Persaingan dari masa kecil kini punya bahasa yang lebih dewasa.',
    callback: { flag: 'friendship', text: 'Dari saling meminjam bola sampai saling mengukur kemampuan, hubungan kalian bertahan. Raka masih bisa membuatmu ingin menjadi lebih baik tanpa mengatakan banyak.' },
    choices: [
      { id: 'raka_shared', label: 'Latihan bersama dan bertukar rekaman', hint: 'Visi dan hubungan · kelebihanmu ikut terbaca lawan', effects: { vision: 4, rival: 5, technique: 2, reputation: -2, fitness: -2 }, flags: ['friendship'], outcome: 'Kalian menemukan kelemahan masing-masing tanpa menutupi ejekan. Raka pulang membawa jawaban tentangmu, dan kamu pulang membawa pertanyaan yang lebih baik tentang permainanmu sendiri.' },
      { id: 'raka_private', label: 'Fokus pada program sendiri', hint: 'Disiplin dan teknik · hubungan lama sedikit menjauh', effects: { discipline: 4, technique: 3, rival: -4, morale: -2 }, flags: ['disciplined'], action: 'training', outcome: 'Kamu mengirim balasan ramah lalu menyelesaikan rencana latihan. Ada kemajuan yang lahir dari kesunyian, meski percakapan kalian kini memerlukan usaha lebih untuk dimulai.' },
    ],
  },
  {
    id: 'prime_commercial', chapter: 'prime', minAge: 23, maxAge: 29, weight: 9,
    title: 'Wajah di papan iklan', scene: 'office', action: 'contract',
    description: 'Nara menerima tawaran kampanye dengan bayaran menarik untuk ukuran kariermu saat ini. Jadwalnya menyentuh beberapa hari bebas yang biasanya kamu pakai untuk pemulihan atau pulang. Dari foto konsep, kamu tampak segar sekali; orang di depan foto itu tahu betapa padatnya minggu ini.',
    callback: { flag: 'moneyFirst', text: 'Kerja sama sebelumnya membuktikan kamu bisa menjadi wajah sebuah merek. Nara kini menyodorkan jadwal lebih rinci karena ia juga melihat harga yang pernah dibayar latihanmu.' },
    choices: [
      { id: 'commercial_full', label: 'Ambil kampanye penuh', hint: 'Pendapatan dan sorotan · kondisi serta waktu keluarga turun', effects: { money: 7000000, reputation: 3, fitness: -4, family: -3 }, flags: ['moneyFirst', 'neglect'], outcome: 'Kampanye berjalan baik dan rekeningmu memperoleh ruang bernapas. Kamu menepati semua jadwal dengan senyum terlatih, lalu kembali ke lapangan membawa kelelahan yang tak terlihat di papan iklan.' },
      { id: 'commercial_limit', label: 'Negosiasikan jadwal yang lebih ringan', hint: 'Kondisi dan keluarga · pendapatan serta sorotan dibatasi', effects: { money: 2000000, fitness: 3, family: 3, reputation: -3 }, flags: ['disciplined'], outcome: 'Nara memangkas hari pengambilan gambar dan sebagian bayaran. Kamu mendapat kembali beberapa pagi tanpa lampu kamera, lalu menggunakannya untuk tubuh dan orang-orang yang jarang meminta.' },
    ],
  },
  {
    id: 'prime_home_roots', chapter: 'prime', minAge: 23, maxAge: 29, weight: 9,
    title: 'Lapangan yang tetap menunggumu', scene: 'street', action: 'pass',
    description: 'Bima mengurus kegiatan anak-anak di lapangan lama dan meminta bantuan sesuai kemampuanmu. Kamu bisa datang langsung atau mendanai perlengkapan sambil menjaga jadwal klub. Di foto yang ia kirim, dua tas sekolah masih dipakai sebagai gawang cadangan.',
    callback: { flag: 'homeRoots', text: 'Kamu tidak sepenuhnya putus dari tempat yang membentukmu. Bima mengenali setiap usaha pulang, bahkan ketika jadwal membuat kunjunganmu singkat.' },
    choices: [
      { id: 'roots_present', label: 'Datang, bermain, dan bantu melatih', hint: 'Keluarga dan dasar kepelatihan · kondisi serta uang terpakai', effects: { family: 5, morale: 4, fitness: -3, money: -3000000 }, flags: ['homeRoots', 'coaching'], coaching: 3, outcome: 'Kamu mengikat tali sepatu seorang anak sebelum menunjukkan cara membuka badan. Bima menyenggol bahumu: dulu kamu yang perlu dibantu; sekarang ada yang menunggu petunjukmu.' },
      { id: 'roots_fund', label: 'Kirim perlengkapan dan jaga program klub', hint: 'Kepercayaan dan latihan · tabungan dan kehadiran pribadi berkurang', effects: { trust: 3, discipline: 3, money: -4000000, family: -2 }, flags: ['disciplined'], action: 'training', outcome: 'Bima mengirim video anak-anak membuka bola baru. Kamu menontonnya setelah sesi klub; bantuanmu sampai, meski kesempatan mendengar tawa mereka langsung harus menunggu.' },
    ],
  },
  {
    id: 'prime_continental', chapter: 'prime', minAge: 23, maxAge: 29, weight: 12,
    title: 'Malam dengan lampu lebih terang', scene: 'stadium', action: 'trophy',
    conditions: { minTier: 4, minOverall: 64, minReputation: 55, injured: false },
    description: 'Tingkat permainan klubmu membawamu ke persaingan Continental Crown, tempat satu kesalahan bisa diputar ulang berkali-kali. Menjelang laga penting, pelatih menawarkan tugas agresif atau peran yang menjaga keseimbangan. Trofi masih harus diperjuangkan; malam ini kamu hanya bisa menentukan bagaimana tim mendekatinya.',
    choices: [
      { id: 'continental_attack', failureShotOutcome:'save', label: 'Ambil tugas yang menentukan di ruang sempit', hint: 'Teknik diuji · prestise besar dengan beban dan risiko', effects: { fitness: -3, injuryRisk: 3 }, skill: 'technique', difficulty: 65, successEffects: { reputation: 6, trust: 4, mentality: 2 }, failureEffects: { reputation: -3, morale: -4 }, flags: ['riskTaker'], action: 'shoot', outcome: 'Gerakanmu membuka momen yang mengubah tekanan pertandingan. Tribun meledak, tetapi tim tetap harus menuntaskan pekerjaannya; kamu telah memberi mereka jalan yang lebih baik.', failure: 'Ruang yang kamu kira terbuka menutup dalam satu langkah. Malam sebesar ini memperbesar kesalahan, tetapi rekan-rekan tetap memanggilmu untuk kembali membentuk tim.' },
      { id: 'continental_balance', label: 'Jaga keseimbangan dan percayai rekan', hint: 'Visi dan kepercayaan · sorotan pribadi lebih kecil', effects: { vision: 4, trust: 5, reputation: -2, mentality: -1 }, flags: ['loyalty'], action: 'pass', outcome: 'Kamu menahan diri agar bentuk tim tetap utuh. Tidak setiap tindakan menjadi cuplikan utama, tetapi rekan-rekan tahu mengapa mereka bisa bergerak lebih bebas malam ini.' },
    ],
  },
  {
    id: 'prime_national', chapter: 'prime', minAge: 23, maxAge: 29, weight: 10,
    title: 'Panggilan untuk seleksi negara', scene: 'academy', action: 'training',
    conditions: { minOverall: 66, minReputation: 60, injured: false },
    description: 'Penampilanmu menarik undangan pemantauan dalam pemusatan tim nasional. Ini kesempatan seleksi, bukan jaminan tampil; pemain lain datang dengan alasan yang sama kuat. Nara mengingatkan bahwa jadwal tambahan juga punya biaya bagi kebugaran dan peran klub.',
    choices: [
      { id: 'national_camp', label: 'Ikuti pemusatan dan rebut perhatian pelatih', hint: 'Disiplin diuji · reputasi naik dengan beban tambahan', effects: { fitness: -4, injuryRisk: 3, playingTime: -2 }, skill: 'discipline', difficulty: 63, successEffects: { reputation: 6, mentality: 3 }, failureEffects: { morale: -3, trust: -2 }, flags: ['ambition'], outcome: 'Kamu mengikuti instruksi dengan konsisten dan menunjukkan kualitas yang bisa diandalkan. Staf seleksi menyimpan namamu; kesempatan berikutnya tetap perlu dijawab dengan penampilan.', failure: 'Intensitas dan penyesuaian tak berjalan semulus harapan. Kamu pulang membawa rincian yang perlu diperbaiki, bukan kepastian tempat; panggilan ini tetap menjadi ukuran baru.' },
      { id: 'national_club', label: 'Jelaskan kondisi dan utamakan program klub', hint: 'Kondisi serta kepercayaan klub · kesempatan seleksi terlewat', effects: { fitness: 5, trust: 4, reputation: -4, morale: -2 }, flags: ['loyalty', 'disciplined'], outcome: 'Kamu menyampaikan keputusan dengan hormat dan meminta pintu komunikasi tetap terbuka. Hari itu berat, tetapi kamu kembali ke klub dengan tenaga yang bisa diberikan sepenuhnya.' },
    ],
  },
  {
    id: 'prime_recovery', chapter: 'prime', minAge: 23, maxAge: 29, weight: 15,
    title: 'Kembali bukan berarti sama', scene: 'medical', action: 'injury', conditions: { injured: true },
    description: 'Ada pola gerak yang dulu kamu lakukan tanpa berpikir, kini harus dipelajari lagi selama pemulihan. Staf medis mengajakmu menetapkan sasaran yang bisa diukur, sementara bagian dirimu yang keras kepala ingin langsung berlari. Raka mengirim pesan: “Kalau perlu lawan latihan pelan, aku bisa pura-pura lambat.”',
    choices: [
      { id: 'prime_rebuild', label: 'Bangun kembali fisik dan ubah cara bermain', hint: 'Pulih dan visi bertambah · kecepatan serta menit dikorbankan', effects: { fitness: 5, vision: 4, pace: -3, playingTime: -5, injuryRisk: -5 }, flags: ['comeback', 'resilience'], injury: 'recover', outcome: 'Kamu mulai mencari ruang sebelum memerlukan kecepatan. Pemulihan belum membuat semuanya mudah, tetapi mengajarkan cara bermain yang tidak bergantung pada satu senjata saja.' },
      { id: 'prime_force', label: 'Percepat kembali demi menjaga tempat', hint: 'Menit dan semangat · kondisi serta risiko kambuh tertekan', effects: { playingTime: 5, morale: 3, fitness: -4, injuryRisk: 6 }, flags: ['riskTaker', 'neglect'], injury: 'risk', action: 'training', outcome: 'Kamu meminta program kembali yang lebih cepat dan mendapat kesempatan bekerja bersama tim. Setiap sesi kini membawa dua pertanyaan: apakah kamu siap bermain, dan apakah kamu bisa terus bermain?' },
    ],
  },
];
