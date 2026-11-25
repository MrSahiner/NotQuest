// Örnek ders. Not yükleme + yapay zeka gelene kadar haritayı ve oyunu bununla deniyoruz.

export type Question = {
  q: string;
  options: string[];
  answer: number; // doğru şıkkın indeksi
};

export type Unit = {
  id: string;
  title: string;
  boss: string; // canavarın adı
  color: string; // canavarın gövde rengi
  questions: Question[];
  final?: boolean;
};

export type Course = {
  id: string;
  title: string;
  units: Unit[];
};

const u1: Question[] = [
  {
    q: "nist'e göre bulut bilişimin 5 temel özelliğinden biri değildir:",
    options: ["isteğe bağlı self-servis", "geniş ağ erişimi", "kaynak havuzu", "sabit fiyatlı lisans"],
    answer: 3,
  },
  {
    q: "\"kullandığın kadar öde\" hangi özellikle ilgilidir?",
    options: ["hızlı esneklik", "ölçülebilir hizmet", "kaynak havuzu", "geniş ağ erişimi"],
    answer: 1,
  },
  {
    q: "talep artınca kaynakların hızla artırılıp azaltılabilmesi:",
    options: ["hızlı esneklik", "self-servis", "çok kiracılık", "yedeklilik"],
    answer: 0,
  },
];

const u2: Question[] = [
  {
    q: "gmail hangi servis modeline örnektir?",
    options: ["iaas", "paas", "saas", "on-premise"],
    answer: 2,
  },
  {
    q: "sanal sunucu kiralıyorsun, işletim sistemini sen yönetiyorsun. bu hangisi?",
    options: ["saas", "iaas", "paas", "faas"],
    answer: 1,
  },
  {
    q: "sadece kodunu yüklüyorsun, sunucuyu sağlayıcı yönetiyor:",
    options: ["paas", "iaas", "özel bulut", "colocation"],
    answer: 0,
  },
];

const u3: Question[] = [
  {
    q: "sadece tek bir kurumun kullandığı bulut:",
    options: ["genel bulut", "topluluk bulutu", "hibrit bulut", "özel bulut"],
    answer: 3,
  },
  {
    q: "özel ve genel bulutun birlikte kullanılması:",
    options: ["hibrit bulut", "çoklu kiracılık", "topluluk bulutu", "sis bilişim"],
    answer: 0,
  },
  {
    q: "aws ve azure'un herkese açık hizmetleri hangi dağıtım modelidir?",
    options: ["özel bulut", "genel bulut", "topluluk bulutu", "yerel veri merkezi"],
    answer: 1,
  },
];

const u4: Question[] = [
  {
    q: "doğrudan donanım üzerinde çalışan hipervizör:",
    options: ["tip 2", "konteyner motoru", "tip 1 (bare-metal)", "emülatör"],
    answer: 2,
  },
  {
    q: "virtualbox hangi tip hipervizördür?",
    options: ["tip 1", "tip 2", "tip 0", "hipervizör değildir"],
    answer: 1,
  },
  {
    q: "konteynerleri sanal makinelerden ayıran temel fark:",
    options: [
      "her biri kendi çekirdeğini çalıştırır",
      "donanımı taklit ederler",
      "ana makinenin çekirdeğini paylaşırlar",
      "sadece linux'ta yoktur",
    ],
    answer: 2,
  },
];

export const DEMO_COURSE: Course = {
  id: "bulut-bilisim",
  title: "bulut bilişim",
  units: [
    { id: "u1", title: "bulut nedir?", boss: "esnek", color: "#5ad17a", questions: u1 },
    { id: "u2", title: "servis modelleri", boss: "katman", color: "#4fa3ff", questions: u2 },
    { id: "u3", title: "dağıtım modelleri", boss: "hibrit", color: "#ff9f43", questions: u3 },
    { id: "u4", title: "sanallaştırma", boss: "hipervizör", color: "#ff5ca8", questions: u4 },
    {
      id: "final",
      title: "vize",
      boss: "final boss",
      color: "#b15cff",
      final: true,
      questions: [u1[1], u2[1], u3[0], u4[0], u4[2], u2[2]],
    },
  ],
};

export function findUnit(id: string | undefined): Unit | undefined {
  return DEMO_COURSE.units.find((u) => u.id === id);
}
