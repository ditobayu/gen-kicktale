import type { StoryEvent } from '../../types/game';

export const academyEvents: StoryEvent[] = [
  {
    id:'academy_club',chapter:'academy',minAge:16,maxAge:16,weight:100,
    title:'Dua undangan, satu pendidikan',scene:'office',action:'contract',
    description:'Coach Ratih dan Ibu menemani percakapan tentang akademi pengembangan. Ada sekolah, jarak dari rumah, kualitas latihan, dan tempat dalam tim yang harus dipikirkan bersama. Sepak bola profesional masih menunggu; hari ini kamu memilih bagaimana bertumbuh.',
    choices:[
      {id:'academy_development',label:'Utamakan pembinaan',hint:'Peran dan pendidikan',effects:{discipline:2},transfer:'minutes',outcome:'Kamu memilih program pembinaan dengan rencana sekolah yang jelas.'},
      {id:'academy_continuity',label:'Lanjutkan bersama Cakrawala',hint:'Kepercayaan dan kedekatan',effects:{trust:4},transfer:'loyal',outcome:'Kamu melanjutkan pendidikan dan latihan bersama orang-orang yang mengenalmu.'},
    ],
  },
  {
    id: 'academy_selection', chapter: 'academy', minAge: 13, maxAge: 17, weight: 11,
    title: 'Nama di papan seleksi', scene: 'academy', action: 'dribble',
    description: 'Papan seleksi akademi dipenuhi nama yang belum kamu kenal. Raka berdiri dua baris di depan, memantulkan tumitnya seperti dulu, dan Coach Ratih mengingatkanmu untuk membawa caramu sendiri bermain. Satu sesi terakhir menentukan peran awalmu di tim.',
    choices: [
      { id: 'selection_show', label: 'Tunjukkan keberanian saat membawa bola', hint: 'Teknik diuji · peluang menonjol dengan risiko kehilangan bola', effects: { mentality: 2, injuryRisk: 2 }, skill: 'technique', difficulty: 51, successEffects: { reputation: 5, playingTime: 4 }, failureEffects: { trust: -3, vision: 2 }, flags: ['riskTaker'], outcome: 'Sentuhan pertamamu membelah tekanan dua pemain. Pelatih mencatat sesuatu di papan, dan kamu mendapat ruang lebih besar untuk membuktikan diri.', failure: 'Sentuhan keduamu terlalu panjang. Kamu kehilangan bola, tetapi segera menutup jalur balik; para pelatih melihat keberanian sekaligus pekerjaan rumahmu.' },
      { id: 'selection_simple', label: 'Baca ruang dan jalankan tugas tim', hint: 'Visi dan kepercayaan · sorotan awal lebih kecil', effects: { vision: 4, trust: 4, reputation: -2, discipline: 2 }, flags: ['disciplined'], action: 'pass', outcome: 'Kamu memindahkan bola sebelum tekanan datang. Tidak banyak orang bertepuk tangan, tetapi pelatih memanggilmu lagi ketika membutuhkan tim yang seimbang.' },
    ],
  },
  {
    id: 'academy_night', chapter: 'academy', minAge: 13, maxAge: 17, weight: 10,
    title: 'Satu ronde terakhir', scene: 'locker', action: 'training',
    description: 'Besok ada latihan pagi, tetapi Bima menghubungimu untuk bermain bersama teman-teman lama. “Satu ronde saja,” katanya, kalimat yang biasanya punya lima bab tambahan. Ponselmu menyala di samping alarm yang sudah dipasang Coach Ratih.',
    choices: [
      { id: 'night_sleep', label: 'Matikan layar dan tidur', hint: 'Pulih dan konsisten · sedikit kehilangan waktu bersama teman', effects: { fitness: 5, discipline: 4, morale: -3 }, flags: ['disciplined'], outcome: 'Pagi datang tanpa tawar-menawar dengan tombol tunda. Kamu sanggup menyelesaikan latihan terakhir ketika beberapa teman mulai kehabisan napas.' },
      { id: 'night_long', label: 'Terus bermain sampai larut', hint: 'Semangat dan teman · kebugaran serta rutinitas turun', effects: { morale: 6, family: 2, fitness: -5, discipline: -3 }, flags: ['neglect', 'friendship'], outcome: 'Kalian tertawa sampai suara harus dikecilkan. Di lapangan esok pagi, kaki terasa berat; kesenangan semalam punya biaya yang langsung terasa.' },
      { id: 'night_limit', label: 'Pasang batas waktu, lalu pamit', hint: 'Jaga hubungan · perkembangan lebih kecil dan tetap sedikit lelah', effects: { morale: 3, discipline: 2, fitness: -2 }, flags: ['friendship'], outcome: 'Bima memprotes dramatis saat waktumu habis, lalu mengucapkan semoga latihan lancar. Kamu tidur cukup baik, meski tidak sesegar malam tanpa layar.' },
    ],
  },
  {
    id: 'academy_raka', chapter: 'academy', minAge: 13, maxAge: 17, weight: 10,
    title: 'Dua nama, satu rompi', scene: 'training', action: 'tackle',
    description: 'Kamu dan Raka mengincar tempat yang sama dalam susunan latihan utama. Ia baru saja mendapat pujian untuk disiplin bertahannya, dan rompi berikutnya masih terlipat di tangan pelatih. Ketika ia menawarkan latihan tambahan berdua, kamu sulit menebak apakah itu persahabatan atau tantangan.',
    choices: [
      { id: 'raka_learn', label: 'Berlatih bersama dan saling koreksi', hint: 'Visi dan hubungan · latihan tambahan menguras tubuh', effects: { vision: 4, rival: 5, fitness: -3, trust: 2 }, flags: ['friendship', 'resilience'], outcome: 'Kamu menunjukkan cara membuka badan; Raka menunjukkan cara menutup kaki dominan. Persaingan tetap ada, tetapi sekarang kalian tahu mengapa lawan di sebelah terasa begitu tangguh.' },
      { id: 'raka_compete', label: 'Buktikan diri dalam duel terbuka', hint: 'Mentalitas diuji · kesempatan merebut peran utama', effects: { rival: -3, fitness: -2 }, skill: 'mentality', difficulty: 53, successEffects: { playingTime: 5, mentality: 3 }, failureEffects: { morale: -4, technique: 2 }, flags: ['riskTaker'], outcome: 'Kamu tetap tenang ketika Raka menekan dan memenangi duel penentu. Rompi utama berpindah kepadamu hari ini; besok ia pasti kembali mengejar.', failure: 'Raka membaca gerakanmu lebih cepat. Kekalahan membuatmu panas, tetapi rekaman duel menunjukkan satu kebiasaan yang selama ini tidak kamu sadari.' },
    ],
  },
  {
    id: 'academy_mentor', chapter: 'academy', minAge: 13, maxAge: 17, weight: 10,
    title: 'Papan tulis Coach Ratih', scene: 'academy', action: 'pass',
    description: 'Coach Ratih menawarkan sesi membaca pertandingan setelah latihan. Sebagian teman memilih kelas teknik individu yang lebih ramai dilihat pencari bakat. Di papan tulisnya ada sebelas lingkaran dan satu pertanyaan: “Apa yang kamu lihat sebelum bola datang?”',
    choices: [
      { id: 'ratih_analysis', label: 'Belajar membaca pertandingan bersamanya', hint: 'Visi dan mentor · lebih sedikit sorotan serta latihan fisik', effects: { vision: 5, mentor: 5, reputation: -2, pace: -2 }, flags: ['mentor'], coaching: 2, outcome: 'Kamu mulai melihat gerak tanpa bola sebagai sebuah kalimat. Coach Ratih menyimpan catatanmu, mengatakan bahwa memahami orang lain akan berguna jauh melampaui pertandingan berikutnya.' },
      { id: 'solo_skills', label: 'Ikut latihan teknik individu', hint: 'Teknik dan kecepatan · hubungan mentor tidak berkembang', effects: { technique: 5, pace: 3, mentor: -3, fitness: -2 }, flags: ['riskTaker'], action: 'dribble', outcome: 'Satu gerakan baru akhirnya berhasil kamu ulang tanpa melihat kaki. Kamu meninggalkan lapangan dengan otot pegal dan keyakinan bahwa bola mulai menurutimu.' },
    ],
  },
  {
    id: 'academy_exam', chapter: 'academy', minAge: 13, maxAge: 17, weight: 9,
    title: 'Ujian tanpa peluit', scene: 'academy', action: 'bench',
    description: 'Jadwal ujian sekolah bertabrakan dengan pemusatan latihan singkat. Ibu menaruh kalender di meja, sementara pelatih menjelaskan bahwa tempatmu bisa diisi pemain lain selama absen. Tidak ada keputusan yang membuat semua orang senang sekaligus.',
    choices: [
      { id: 'exam_study', label: 'Utamakan ujian, minta program latihan rumah', hint: 'Disiplin dan keluarga · posisi dalam tim perlu direbut lagi', effects: { discipline: 5, family: 5, playingTime: -5, trust: -2 }, flags: ['disciplined'], outcome: 'Kamu menuntaskan ujian dan mengirim catatan latihan rumah. Saat kembali, rompi utama belum menunggumu, tetapi kebiasaan mengatur waktu telah menjadi milikmu.' },
      { id: 'exam_camp', label: 'Ikut pemusatan, belajar di sela perjalanan', hint: 'Menit dan teknik · kesehatan dan keluarga tertekan', effects: { playingTime: 5, technique: 3, fitness: -4, family: -3 }, flags: ['riskTaker'], action: 'training', outcome: 'Kamu meraih pengalaman latihan yang sulit diganti. Belajar dengan lampu bus bergoyang jauh lebih susah daripada rencanamu di kertas; jadwal ketat meminta tenaga dari dua sisi.' },
    ],
  },
  {
    id: 'academy_bench', chapter: 'academy', minAge: 13, maxAge: 17, weight: 10,
    title: 'Menghangat di luar garis', scene: 'stadium', action: 'bench',
    description: 'Namamu tidak masuk susunan awal laga persahabatan. Dari bangku cadangan kamu melihat ruang yang berulang kali ditinggalkan lawan, tetapi pelatih masih berdiri dengan tangan terlipat. Raka lewat untuk pemanasan dan mengetuk bahumu sekali.',
    choices: [
      { id: 'bench_observe', label: 'Catat celah lawan dan tunggu panggilan', hint: 'Visi dan kepercayaan · semangat perlu ditahan', effects: { vision: 4, trust: 4, morale: -3, discipline: 2 }, flags: ['resilience'], outcome: 'Ketika akhirnya dipanggil, kamu sudah tahu ke mana bola berikutnya harus pergi. Kesabaran tidak membuat menunggu menyenangkan, tetapi membuat waktumu berguna.' },
      { id: 'bench_request', label: 'Minta kesempatan dengan tegas', hint: 'Mentalitas diuji · bisa mendapat menit atau dianggap terburu-buru', effects: { mentality: 2 }, skill: 'mentality', difficulty: 52, successEffects: { playingTime: 5, reputation: 2 }, failureEffects: { trust: -4, morale: -2 }, flags: ['riskTaker'], outcome: 'Kamu menyebut ruang yang bisa dimanfaatkan, bukan sekadar meminta bermain. Pelatih menunjuk lapangan; sekarang penjelasanmu harus menjadi tindakan.', failure: 'Pelatih menyuruhmu kembali duduk. Kamu belum berhasil membuatnya yakin, dan nada bicaramu menambah pekerjaan untuk latihan berikutnya.' },
    ],
  },
  {
    id: 'academy_scout', chapter: 'academy', minAge: 13, maxAge: 17, weight: 9,
    title: 'Orang dengan buku kecil', scene: 'stadium', action: 'shoot',
    description: 'Ada pengamat di tribun latihan, duduk dengan buku kecil yang semua orang pura-pura tidak lihat. Coach Ratih meminta tim tetap menjalankan pola. Bola datang padamu ketika dua teman membuka ruang, sementara jalur tembakan juga baru saja terbuka.',
    choices: [
      { id: 'scout_finish', failureShotOutcome:'blocked', label: 'Ambil peluang sendiri', hint: 'Teknik diuji · reputasi dapat melonjak, kepercayaan dipertaruhkan', effects: { mentality: 2, trust: -2 }, skill: 'technique', difficulty: 56, successEffects: { reputation: 6, technique: 2 }, failureEffects: { morale: -3, trust: -2 }, flags: ['riskTaker'], outcome: 'Bola melesat ke ruang yang kamu incar. Buku kecil di tribun bergerak, tetapi Coach Ratih tetap meminta kamu menjelaskan keputusan itu setelah laga.', failure: 'Tembakanmu tertahan kaki lawan. Teman yang bebas merentangkan tangan; keberanianmu terlihat, begitu juga keputusan yang belum matang.' },
      { id: 'scout_assist', label: 'Kirim bola ke rekan yang bebas', hint: 'Visi dan kepercayaan · peluang disorot sendiri berkurang', effects: { vision: 4, trust: 5, reputation: -2, morale: 1 }, flags: ['loyalty'], action: 'pass', outcome: 'Umpanmu membuat peluang lebih sederhana. Pengamat itu tetap menulis; rupanya yang menciptakan jalan juga bisa menarik perhatian.' },
    ],
  },
  {
    id: 'academy_home', chapter: 'academy', minAge: 13, maxAge: 17, weight: 9,
    title: 'Pesan suara dari rumah', scene: 'locker', action: 'training',
    description: 'Jadwal akademi membuatmu jarang pulang. Ibu mengirim pesan suara tentang tetangga yang masih menanyakan kabarmu dan lapangan kecil yang baru dicat ulang. Ada hari kosong di akhir pekan, sekaligus kesempatan latihan tambahan bersama Raka.',
    choices: [
      { id: 'home_visit', label: 'Pulang dan main sebentar dengan Bima', hint: 'Keluarga dan semangat · perkembangan teknik tertunda', effects: { family: 6, morale: 4, technique: -2, trust: -2 }, flags: ['homeRoots', 'friendship'], action: 'pass', outcome: 'Bima menyambutmu dengan bola yang kulitnya makin tipis. Di lapangan lama, kamu kembali menjadi teman yang terlambat pulang, dan untuk sehari itu terasa cukup.' },
      { id: 'home_train', label: 'Tetap latihan, telepon Ibu setelahnya', hint: 'Teknik dan disiplin · hubungan butuh waktu lebih', effects: { technique: 4, discipline: 3, family: -4, morale: -1 }, flags: ['disciplined'], outcome: 'Latihan berjalan baik dan Raka memberi perlawanan sungguh-sungguh. Saat menelepon, Ibu senang mendengar suaramu, lalu bertanya kapan kursi di meja makan terisi lagi.' },
    ],
  },
  {
    id: 'academy_niggle', chapter: 'academy', minAge: 13, maxAge: 17, weight: 8,
    title: 'Betis yang mulai protes', scene: 'medical', action: 'injury',
    description: 'Betismu terasa tertarik setelah beberapa pekan latihan padat. Tidak ada bunyi dramatis, hanya rasa kaku yang datang kembali saat kamu berlari. Coach Ratih mengantarmu ke petugas medis dan meminta jawaban jujur, bukan jawaban paling gagah.',
    choices: [
      { id: 'niggle_rest', label: 'Laporkan keluhan dan kurangi beban', hint: 'Kondisi membaik · menit serta ketajaman sementara turun', effects: { fitness: 4, injuryRisk: -6, playingTime: -4, pace: -2 }, flags: ['disciplined'], injury: 'recover', outcome: 'Program latihanmu diubah untuk beberapa waktu. Menonton teman berlari memang menyebalkan, tetapi kamu belajar membedakan kerja keras dan mengabaikan sinyal tubuh.' },
      { id: 'niggle_push', label: 'Kejar latihan penuh meski terasa kaku', hint: 'Kesempatan bermain · risiko cedera meningkat', effects: { playingTime: 5, mentality: 2, injuryRisk: 6, fitness: -3 }, flags: ['neglect', 'riskTaker'], injury: 'risk', action: 'training', outcome: 'Kamu menyelesaikan sesi dan mempertahankan tempat hari ini. Kaki tetap mengirim peringatan; keberhasilan satu sore belum menjawab biaya minggu berikutnya.' },
    ],
  },
  {
    id: 'academy_help', chapter: 'academy', minAge: 13, maxAge: 17, weight: 8,
    title: 'Adik kelas di tepi lapangan', scene: 'academy', action: 'pass',
    description: 'Seorang pemain baru berkali-kali kehilangan bola dan mulai menunduk setiap menerima umpan. Coach Ratih memintamu membantu, tepat saat kelas sprint tambahan dibuka di sisi lain lapangan. Kamu teringat bagaimana rasanya menjadi anak yang tidak mengenal siapa-siapa.',
    choices: [
      { id: 'help_youth', label: 'Temani ia belajar menerima bola', hint: 'Visi dan kepemimpinan · latihan kecepatan terlewat', effects: { vision: 4, trust: 3, pace: -2, morale: 2 }, flags: ['mentor', 'coaching'], coaching: 3, outcome: 'Kamu mengubah petunjuk menjadi kalimat yang bisa dipahami. Saat ia berhasil mengontrol bola, rasa bangganya menular; Coach Ratih melihat bahwa kamu bisa membuat orang lain berani.' },
      { id: 'help_self', label: 'Minta pelatih lain membantu, ikut sprint', hint: 'Kecepatan dan kebugaran · hubungan mentor tumbuh lebih lambat', effects: { pace: 5, fitness: 3, mentor: -2, morale: -1 }, flags: ['disciplined'], action: 'training', outcome: 'Kamu memastikan anak itu punya pendamping lalu pindah jalur latihan. Set sprint terakhir terasa berat, tetapi catatan waktumu mulai bergerak ke arah yang kamu inginkan.' },
    ],
  },
];
