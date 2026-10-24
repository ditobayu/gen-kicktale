import type { StoryEvent } from '../../types/game';

export const professionalEvents: StoryEvent[] = [
  {
    id: 'professional_contract', chapter: 'professional', minAge: 18, maxAge: 18, weight: 100,
    title: 'Tanda tangan pertamamu', scene: 'office', action: 'contract',
    description: 'Nara, agen yang direkomendasikan Coach Ratih, menata berkas di meja kecil. “Kita bicara dengan klub yang benar-benar tertarik pada perjalananmu,” katanya; fasilitas, persaingan, dan menit bermain tidak selalu datang dalam paket yang sama. Ibu menunggu di sampingmu, membiarkan pena itu menjadi keputusanmu.',
    callback: { flag: 'mentor', text: 'Catatan dan rekomendasi Coach Ratih ikut membuka pintu pertemuan ini. Nasihatnya masih sama: pilih tempat yang memberi ruang untuk bertumbuh.' },
    choices: [
      { id: 'contract_ambition', label: 'Kejar proyek paling ambisius yang tersedia', hint: 'Fasilitas dan bayaran · persaingan serta tekanan lebih besar', effects: { reputation: 3, money: 4000000, playingTime: -5, morale: -2 }, transfer: 'ambition', flags: ['ambition'], outcome: 'Nara menindaklanjuti jalur ambisi yang sesuai dengan penilaian klub terhadapmu. Kamu mendapat tantangan baru dan meja latihan yang lebih menuntut; tempat utama tetap harus direbut.' },
      { id: 'contract_minutes', label: 'Pilih jalur dengan ruang bermain lebih besar', hint: 'Pengalaman dan kepercayaan · bayaran serta sorotan lebih kecil', effects: { playingTime: 6, trust: 3, money: -3000000, reputation: -2 }, transfer: 'minutes', flags: ['minutesFirst'], outcome: 'Kamu memilih percakapan tentang peran di lapangan sebelum membahas angka kontrak. Pelatih punya ruang untukmu, dan kini kamu harus mengisinya dengan penampilan yang nyata.' },
      { id: 'contract_home', label: 'Utamakan kesempatan di dekat rumah', hint: 'Keluarga dan rasa memiliki · jangkauan pilihan lebih sempit', effects: { family: 5, morale: 3, money: -2000000, reputation: -2 }, transfer: 'home', flags: ['homeRoots'], outcome: 'Nara memusatkan pembicaraan pada jalur pulang yang memungkinkan. Ibu mengembuskan napas lega; di depanmu ada pekerjaan profesional yang tetap harus dituntaskan, berapa pun jaraknya dari rumah.' },
    ],
  },
  {
    id: 'professional_debut', chapter: 'professional', minAge: 18, maxAge: 22, weight: 11,
    title: 'Saat namamu dipanggil', scene: 'stadium', action: 'pass',
    description: 'Suara tribun terasa lebih besar dari seluruh lapangan masa kecilmu. Dalam sesi penampilan yang penting bagi tempatmu di skuad, pelatih meminta satu hal: jangan sembunyikan dirimu. Bola mengarah kepadamu, dan kamu punya sepersekian detik untuk memilih cara masuk ke pertandingan.',
    choices: [
      { id: 'debut_brave', label: 'Cari umpan yang memecah tekanan', hint: 'Visi diuji · peluang besar dengan risiko kehilangan bola', effects: { mentality: 2, fitness: -2 }, skill: 'vision', difficulty: 56, successEffects: { reputation: 5, trust: 4 }, failureEffects: { trust: -3, morale: -3 }, flags: ['riskTaker'], outcome: 'Kamu melihat gerak rekan sebelum lawan menoleh. Umpan itu melewati garis tekanan, dan riuh tribun kini terdengar seperti ajakan, bukan ancaman.', failure: 'Lawan membaca jalurnya lebih cepat. Kamu mengejar balik sambil mendengar pelatih memintamu tetap berani; kesalahan pertama tidak harus menjadi seluruh kisahmu.' },
      { id: 'debut_simple', label: 'Jaga bola dan bangun ritme pelan-pelan', hint: 'Teknik dan kepercayaan · sorotan pribadi lebih kecil', effects: { technique: 3, trust: 4, morale: 2, reputation: -2 }, flags: ['disciplined'], outcome: 'Sentuhan pendek membuat napasmu kembali teratur. Kamu tidak memaksa momen besar, dan pelatih mulai percaya bahwa bola aman ketika melewati kakimu.' },
    ],
  },
  {
    id: 'professional_bench', chapter: 'professional', minAge: 18, maxAge: 22, weight: 10,
    title: 'Angka di papan pergantian', scene: 'locker', action: 'bench',
    description: 'Persaingan skuad membuatmu tidak selalu mendapat menit sebanyak yang kamu harapkan. Nara bertanya apakah kamu ingin mencari jalur lain, sementara pelatih menilai ada tempat untukmu jika satu aspek permainan diperbaiki. Menunggu bisa menjadi investasi, atau sekadar kebiasaan yang nyaman.',
    choices: [
      { id: 'bench_stay', label: 'Tetap bersaing, minta target latihan jelas', hint: 'Teknik dan kepercayaan · menit tidak langsung bertambah', effects: { technique: 4, trust: 4, playingTime: -3, morale: -2 }, flags: ['loyalty', 'disciplined'], action: 'training', outcome: 'Pelatih memberimu target yang bisa dikerjakan, bukan janji kosong. Kamu bertahan untuk memperjuangkan tempat, sadar bahwa kerja hari ini belum tentu muncul di susunan besok.' },
      { id: 'bench_move', label: 'Minta Nara mencari menit di tempat lain', hint: 'Peluang bermain · perlu membangun hubungan dari awal', effects: { playingTime: 5, trust: -4, money: -2000000, mentality: 2 }, transfer: 'minutes', flags: ['minutesFirst'], action: 'contract', outcome: 'Nara membuka pembicaraan pada klub yang membutuhkan peranmu. Meninggalkan rasa akrab terasa berat, tetapi kamu ingin kemampuanmu diuji dengan pertandingan sungguhan.' },
    ],
  },
  {
    id: 'professional_pathway', chapter: 'professional', minAge: 18, maxAge: 22, weight: 9,
    title: 'Peta yang dilipat Nara', scene: 'office', action: 'contract',
    description: 'Nara membawa penilaian terkini dari klub-klub yang memantau perkembanganmu. Ada jalur dengan persaingan lebih ketat dan jalur yang menjanjikan tugas lebih jelas, sejauh minat klub memungkinkan. “Nama besar tidak bisa menendang bola untukmu,” katanya sambil melipat peta perjalanan.',
    callback: { flag: 'minutesFirst', text: 'Dulu kamu menaruh menit bermain di depan sorotan. Pengalaman dari pilihan itu kini menjadi bahan utama saat Nara membicarakan masa depanmu.' },
    choices: [
      { id: 'pathway_step', label: 'Uji batas di proyek yang lebih menantang', hint: 'Reputasi dan pendapatan · peran bisa mengecil', effects: { reputation: 3, money: 4000000, playingTime: -4, morale: -2 }, transfer: 'ambition', flags: ['ambition'], outcome: 'Kamu memberi Nara izin mengejar langkah paling menantang yang realistis. Tujuannya jelas, tetapi kamu masih harus mengubah fasilitas dan kesempatan menjadi perkembangan nyata.' },
      { id: 'pathway_role', label: 'Cari tim yang membutuhkan peranku', hint: 'Menit dan semangat · sorotan serta gaji dikorbankan', effects: { playingTime: 5, morale: 3, reputation: -3, money: -2000000 }, transfer: 'minutes', flags: ['minutesFirst'], outcome: 'Pertanyaan pertamamu kepada pelatih adalah bagaimana kamu akan digunakan. Jawaban tentang ruang di lapangan terasa lebih berguna daripada foto megah di brosur klub.' },
      { id: 'pathway_stay', label: 'Lanjutkan rencana bersama klub saat ini', hint: 'Kepercayaan dan stabilitas · pendapatan tambahan terlewat', effects: { trust: 5, discipline: 2, money: -3000000, morale: -1 }, transfer: 'loyal', flags: ['loyalty'], outcome: 'Kamu meminta rencana perkembangan yang lebih rinci lalu kembali berlatih. Nara menyimpan peta; untuk sekarang, tantanganmu masih berada di lapangan yang sudah kamu kenal.' },
    ],
  },
  {
    id: 'professional_media', chapter: 'professional', minAge: 18, maxAge: 22, weight: 9,
    title: 'Komentar di layar kecil', scene: 'locker', action: 'training',
    description: 'Cuplikan kesalahan latihanmu beredar dengan judul yang lebih heboh daripada kejadian aslinya. Ada yang membela, ada yang merasa paling tahu masa depanmu. Bima mengirim pesan pendek: “Di lapangan dulu kamu juga pernah salah oper. Besok tetap main, kan?”',
    choices: [
      { id: 'media_quiet', label: 'Tutup layar dan kerjakan satu kelemahan', hint: 'Teknik dan disiplin · semangat belum langsung pulih', effects: { technique: 4, discipline: 3, morale: -3, reputation: -1 }, flags: ['resilience', 'disciplined'], outcome: 'Kamu memilih satu detail untuk diperbaiki dan mengulangnya sampai gerakmu lebih bersih. Komentar belum berhenti, tetapi perhatianmu kembali ke sesuatu yang bisa kamu ubah.' },
      { id: 'media_respond', label: 'Jawab dengan tenang di depan media', hint: 'Mentalitas diuji · reputasi bisa pulih atau makin tertekan', effects: { fitness: -2 }, skill: 'mentality', difficulty: 55, successEffects: { reputation: 5, morale: 3 }, failureEffects: { reputation: -3, morale: -3 }, flags: ['riskTaker'], outcome: 'Kamu mengakui kesalahan tanpa mengecilkan diri. Jawabanmu tidak membuat semua orang setuju, tetapi menunjukkan bahwa kamu sanggup berdiri di belakang pekerjaanmu.', failure: 'Satu kalimatmu dipotong menjadi judul baru. Kamu belajar bahwa menjelaskan diri juga butuh keterampilan, dan layar akhirnya kamu serahkan dulu kepada Nara.' },
    ],
  },
  {
    id: 'professional_rehab', chapter: 'professional', minAge: 18, maxAge: 22, weight: 15,
    title: 'Kalender ruang pemulihan', scene: 'medical', action: 'injury', conditions: { injured: true },
    description: 'Hari-harimu diukur dengan latihan pemulihan, bukan jadwal pertandingan. Petugas medis menunjukkan tahap berikutnya, dan kamu menatap kalender lebih lama daripada seharusnya. Coach Ratih menelepon untuk mengingatkan bahwa membangun kembali karier juga merupakan keterampilan.',
    choices: [
      { id: 'rehab_patient', label: 'Ikuti tahap pemulihan sampai tuntas', hint: 'Tubuh dan ketangguhan · menit serta ritme tertunda', effects: { fitness: 5, mentality: 3, playingTime: -5, injuryRisk: -6 }, flags: ['comeback', 'resilience', 'disciplined'], injury: 'recover', outcome: 'Kemajuanmu kecil tetapi bisa diulang. Kamu belajar merayakan gerakan tanpa nyeri, lalu membangun keberanian dari bukti bahwa tubuh perlahan bisa dipercaya lagi.' },
      { id: 'rehab_rush', label: 'Minta kembali latihan penuh lebih cepat', hint: 'Peluang menit lebih cepat · risiko kambuh meningkat', effects: { playingTime: 5, morale: 3, fitness: -3, injuryRisk: 6 }, flags: ['riskTaker', 'neglect'], injury: 'risk', action: 'training', outcome: 'Kamu kembali mendengar sepatu menghantam rumput bersama tim. Semangat naik, tetapi petugas medis mengawasi setiap perubahan langkah; waktu yang dipercepat belum tentu benar-benar kamu hemat.' },
    ],
  },
  {
    id: 'professional_nara', chapter: 'professional', minAge: 18, maxAge: 22, weight: 9,
    title: 'Nilai di luar lapangan', scene: 'office', action: 'contract',
    description: 'Sebuah merek lokal menawarkan kerja sama promosi melalui Nara. Bayarannya bisa membantu keluarga, tetapi sesi pengambilan gambar memakan waktu latihan tambahan. Ibu meminta kamu membaca rincian jadwal, bukan sekadar angka paling tebal di halaman terakhir.',
    choices: [
      { id: 'deal_money', label: 'Ambil jadwal promosi yang lebih padat', hint: 'Pendapatan dan dikenal publik · latihan serta pemulihan berkurang', effects: { money: 6000000, reputation: 3, fitness: -3, discipline: -3 }, flags: ['moneyFirst', 'neglect'], outcome: 'Kamu mengirim sebagian pendapatan untuk rumah dan belajar tersenyum di bawah lampu kamera. Jadwal bertambah penuh; menjaga permainan kini perlu usaha yang lebih sengaja.' },
      { id: 'deal_small', label: 'Batasi kerja sama agar latihan tetap utuh', hint: 'Disiplin dan kebugaran · pendapatan tambahan lebih kecil', effects: { money: 2000000, discipline: 4, fitness: 2, reputation: -2 }, flags: ['disciplined'], outcome: 'Nara menegosiasikan jadwal yang lebih ringan. Angkanya mengecil, tetapi kamu masih punya pagi yang lapang untuk pekerjaan yang membawa tawaran itu kepadamu.' },
    ],
  },
  {
    id: 'professional_raka', chapter: 'professional', minAge: 18, maxAge: 22, weight: 10,
    title: 'Raka di seberang garis', scene: 'stadium', action: 'tackle',
    description: 'Dalam laga uji coba, Raka berdiri di sisi berlawanan dan mengangguk sebelum peluit. Wajahnya lebih dewasa, tetapi kebiasaannya memantulkan tumit belum berubah. Kalian sama-sama tahu duel ini bisa menjadi ukuran seberapa jauh perjalanan dari Cakrawala Junior.',
    callback: { flag: 'friendship', text: 'Ada terlalu banyak latihan dan tawa bersama untuk menganggapnya orang asing. Kamu ingin mengalahkan Raka, lalu tetap bisa menatap matanya sesudahnya.' },
    choices: [
      { id: 'raka_press', label: 'Tekan Raka dan paksa duel langsung', hint: 'Kebugaran diuji · pembuktian pribadi menguras tenaga', effects: { fitness: -3, injuryRisk: 2 }, skill: 'fitness', difficulty: 57, successEffects: { reputation: 4, rival: 3, mentality: 2 }, failureEffects: { trust: -3, morale: -2 }, flags: ['riskTaker'], outcome: 'Kamu menutup ruang sebelum ia sempat berbalik. Raka tersenyum kesal, tanda penghormatan yang sudah kamu kenal sejak lapangan berdebu.', failure: 'Raka mengalirkan bola sebelum tekananmu tiba. Kamu terseret keluar bentuk tim dan harus bekerja dua kali untuk menutup ruang yang tertinggal.' },
      { id: 'raka_shape', label: 'Jaga bentuk tim dan baca pilihannya', hint: 'Visi serta kepercayaan · kesempatan duel pribadi terlewat', effects: { vision: 4, trust: 4, mentality: -2, rival: 2 }, flags: ['disciplined'], action: 'pass', outcome: 'Kamu menolak terseret pertandingan kecil di dalam pertandingan besar. Raka tak mendapat ruang semudah yang ia harapkan; usai peluit, ia mengakui kamu makin sulit ditebak.' },
    ],
  },
  {
    id: 'professional_home', chapter: 'professional', minAge: 18, maxAge: 22, weight: 9,
    title: 'Tiket pulang yang belum dibeli', scene: 'locker', action: 'pass',
    description: 'Ibu bilang semuanya baik-baik saja, dengan nada yang membuatmu ingin bertanya lagi. Bima mengabarkan kegiatan kecil di lapangan masa kecilmu dan berharap kamu bisa datang. Ada jeda singkat dari tim, tetapi perjalanan pulang akan menggantikan beberapa sesi pengembangan pribadi.',
    choices: [
      { id: 'pro_home_visit', label: 'Pulang dan hadir untuk orang-orang lama', hint: 'Keluarga dan semangat · latihan teknik terpotong', effects: { family: 6, morale: 4, technique: -3, money: -2000000 }, flags: ['homeRoots'], outcome: 'Kamu membantu Ibu tanpa seragam latihan, lalu mengirim beberapa umpan untuk anak-anak di lapangan. Bima meledek gaya rambutmu; ada tempat di mana karier bukan seluruh namamu.' },
      { id: 'pro_home_train', label: 'Tetap berlatih, bantu dari jauh', hint: 'Perkembangan dan kepercayaan · hubungan serta tabungan berkurang', effects: { technique: 4, trust: 3, family: -3, money: -2000000 }, flags: ['disciplined'], action: 'training', outcome: 'Kamu mengirim bantuan dan mengatur panggilan video setelah latihan. Perkembanganmu terasa nyata, begitu juga keheningan singkat ketika Ibu bilang akan menyisakan makanan favoritmu lain waktu.' },
    ],
  },
  {
    id: 'professional_extra', chapter: 'professional', minAge: 18, maxAge: 22, weight: 9,
    title: 'Setelah lampu latihan padam', scene: 'training', action: 'shoot',
    description: 'Pelatih menawarkan sesi tambahan singkat untuk memperbaiki sentuhan dalam tekanan. Tubuhmu lelah, tetapi ada detail permainan yang terus mengganggu pikiran. Coach Ratih mengirim pesan: “Latihan yang berguna itu yang bisa kamu cerna, bukan hanya yang paling lama.”',
    choices: [
      { id: 'extra_reps', label: 'Ambil sesi teknik dengan intensitas tinggi', hint: 'Teknik dan kecepatan · kebugaran serta risiko tertekan', effects: { technique: 5, pace: 2, fitness: -4, injuryRisk: 4 }, flags: ['riskTaker'], injury: 'risk', outcome: 'Kamu mengulang sentuhan sampai gerakmu makin cepat. Ada rasa puas ketika bola mengikuti kaki, tetapi perjalanan pulang terasa lebih berat dari biasanya.' },
      { id: 'extra_video', label: 'Pilih sesi video dan pemulihan', hint: 'Visi dan kebugaran · ketajaman teknik tak bertambah hari ini', effects: { vision: 4, fitness: 3, injuryRisk: -3, technique: -2 }, flags: ['disciplined'], action: 'training', outcome: 'Dari rekaman, kamu menemukan bahwa masalahnya dimulai pada posisi badan sebelum menerima bola. Kamu pulang dengan satu petunjuk jelas dan tenaga untuk mencobanya esok hari.' },
    ],
  },
];
