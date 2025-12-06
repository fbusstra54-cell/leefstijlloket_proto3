
import { Article, FAQItem, Badge, Challenge, CommunityPost } from './types';
import { Activity, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

// --- Gamification Constants ---
export const POINTS = {
  LOG_WEIGHT: 10,
  LOG_CHECKIN: 15,
  LOG_MEAL: 5,
  JOIN_CHALLENGE: 50,
  COMPLETE_CHALLENGE: 250,
  READ_ARTICLE: 20,
  COMMUNITY_REACTION: 2
};

export const LEVELS = [
  { name: 'Starter', minPoints: 0, maxPoints: 500 },
  { name: 'Doorzetter', minPoints: 500, maxPoints: 1500 },
  { name: 'Krachtpatser', minPoints: 1500, maxPoints: 3000 },
  { name: 'VitaMeester', minPoints: 3000, maxPoints: Infinity }
];

export const ARTICLES: Article[] = [
  {
    id: '5',
    title: 'Prostaatkanker en lifestyle: hoezo?!',
    excerpt: 'Net nu je weet dat prostaatkanker is vastgesteld, moet je ook nog je leefstijl aanpassen. Waarom dat juist nu zinvol is.',
    category: 'Medisch',
    content: `Het is misschien wat vreemd: Net nu je weet dat prostaatkanker is vastgesteld, moet je nu ook nog eens je leefstijl gaan aanpassen. Hopelijk kan wat uitleg dat gevoel verzachten of zelfs enthousiasmeren: zelf weer aan het roer!

Prostaatkanker is een aandoening die vele gezichten kent. In meer dan de helft van de gevallen is behandeling (nog) niet nodig. Soms is directe behandeling juist wel zinvol maar zelfs dan is er vaak wat te optimaliseren. En soms wordt prostaatkanker in een laat stadium ontdekt waarbij meteen wordt gezegd: genezing is niet meer mogelijk. Maar ook dan kan leefstijl een wereld van verschil uitmaken. Hieronder zetten we de verschillende situaties onder elkaar.

1. Prostaatkanker in een vroeg stadium (Active Surveillance)
Niet agressief, genezende behandeling kan worden uitgesteld. Dat noemen we dan active surveillance; Uitstel van een genezende behandeling. Dus ook uitstel van bijwerkingen daarvan. Ook indien je nooit zou behandeling dan zal deze vorm van prostaatkanker pas na 15-20 jaar levensbedreigend worden. Of nooit. Maar na 10 jaar zal toch de helft van de mensen wel behandeld zijn. Dan is het jammer als andere aandoeningen, overgewicht of een matige conditie je behandelkeuzes hebben verkleind.

2. Prostaatkanker in een vroeg stadium (Watchful Waiting)
Niet agressief, genezende behandeling is niet nodig omdat verwacht wordt dat andere aandoeningen of zeer hoge leeftijd eerder van belang worden. Dat noemen we dan watchfull waiting; Uitstel van een remmende ('palliatieve') behandeling. Dus ook uitstel van bijwerkingen daarvan. Toch kan het zijn dat er na een aantal jaren uitzaaiingen optreden en remmende behandelingen nodig zijn. Die worden veel beter verdragen als je in topconditie bent, als je niet meer rookt, als je alcohol bent gaan matigen en overgewicht hebt weten terug te dringen.

3. Prostaatkanker in een vroeg stadium, genezing is goed mogelijk
Behandeling is binnen 3 maanden aangewezen. Zo’n behandeling kan bijwerkingen hebben of risico’s.

- Als de prostaat met een operatie moet worden verwijderd: het narcoserisico is kleiner als er minder of geen overgewicht is. En als roken wordt gestopt. En als je conditie verbetert. Je lijf en je hart moeten, indien onder narcose, hard aan de slag. Vergelijk het met een hardloop wedstrijd. Dat gaat al veel beter als je 6 weken getraind hebt.

- Als de prostaat moet worden bestraald: bijwerkingen zoals moeheid en malaise kunnen verminderen als je conditie op pijl is en als beweging onderdeel is gaan uitmaken van je dagelijkse routines. Misschien maakt het de gang naar en van het ziekenhuis ook net wat makkelijker.

- Als de prostaat wordt bestraald maar ook tijdelijk hormoontherapie moet worden gestart: de bijwerkingen van hormoontherapie worden veel beter verdragen als je in topconditie bent, als je niet meer rookt, als je alcohol bent gaan matigen en overgewicht hebt weten terug te dringen.

4. Prostaatkanker in een laat stadium
Genezing is niet mogelijk. Er zijn uitzaaiingen.

- Als het weefselonderzoek en de overige uitslagen duiden op een langzaam groeiend proces dan kan gekozen worden voor watchfull waiting, uitstel van remmende ('palliatieve') behandelingen.

- Als het weefselonderzoek en de overige uitslagen duiden op een snel groeiend proces dan kan geadviseerd worden meteen te starten met remmende ('palliatieve') behandelingen. De basis is dan altijd hormoontherapie. Het mannelijke hormoon Testosteron veroorzaakt namelijk groei van de tumorcellen. Remmen van Testosteron remt dus te tumor af. De tumor zelf en de uitzaaiingen worden kleiner. Helaas geeft zo’n behandeling bijwerkingen.

Veelvoorkomende bijwerkingen van hormoontherapie:
- Energievermindering, krachtverlies en afname van spiermassa
- Opvliegers (bij de meeste mannen de irritantste bijwerking)
- Afname van seksueel verlangen (libido)
- Risico op botontkalking
- Gewichtstoename
- Toename risico op hart- en vaatziekten
- Vertraging denkvermogen/cognitie
- Beïnvloeding gemoedstoestand
- Stijver worden van gewrichten

Hoe leefstijl hierbij helpt:
Bijwerkingen worden veel beter verdragen als je in topconditie bent.
- Energievermindering is beduidend minder als je 3 maal daags actief bent. Beter 3 maal per dag wat wandelen dan eenmaal per dag overbelasten.
- Kans op botontkalking is kleiner als je dagelijks je botten belast met bewegen. En Vitaminde D en Calcium natuurlijk.
- Stijfheid van gewrichten is lastig te verhelpen. Maar rustige bewegingen zoals wandelen of zwemmen houdt de gewrichten beter soepel dan steeds minder gaan doen.
- Hart- en vaatziekten treden minder snel op als je actief bent, je gewicht weet te verminderen en als je niet rookt.

Kortom:
Je kan een hoop zelf doen om je vooruitzichten te verbeteren. Uw lijf verdient meer aandacht dan die vervelende ziekte. En daar kunt u zelf iets aan doen. 95% van de mensen heeft daar wat hulp bij nodig om verbeteringen langer dan een maand te laten duren. Dus schroom niet om hulp te vragen. Als u hulp nodig hebt dan bent u een gemiddeld mens. Als u hulp vraagt, bent u bovengemiddeld! Juist dát helpt u verder! Uw kwaliteit van leven maakt dan sprongen!`,
    imageUrl: 'https://picsum.photos/id/191/800/600',
    date: '2023-11-20',
    author: 'Dr. M. Busstra'
  },
  {
    id: '1',
    title: 'De Rol van Voeding bij Herstel',
    excerpt: 'Hoe een uitgebalanceerd dieet kan bijdragen aan uw energieniveau en herstel tijdens de behandeling.',
    category: 'Voeding',
    content: 'Uitgebreide content over voeding...',
    imageUrl: 'https://picsum.photos/id/1080/800/600',
    date: '2023-10-15',
    author: 'Dr. A. Jansen'
  },
  {
    id: '2',
    title: 'Blijven Bewegen: Waarom en Hoe?',
    excerpt: 'Beweging is cruciaal, zelfs bij vermoeidheid. Ontdek laagdrempelige oefeningen die passen bij uw situatie.',
    category: 'Beweging',
    content: 'Uitgebreide content over beweging...',
    imageUrl: 'https://picsum.photos/id/73/800/600',
    date: '2023-10-20',
    author: 'Fysio B. de Vries'
  },
  {
    id: '3',
    title: 'Mentale Veerkracht na de Diagnose',
    excerpt: 'Het verwerken van de diagnose vraagt tijd. Tips om mentaal sterk te blijven en steun te vinden.',
    category: 'Mentaal',
    content: 'Uitgebreide content over mentale gezondheid...',
    imageUrl: 'https://picsum.photos/id/449/800/600',
    date: '2023-11-01',
    author: 'Psycholoog K. Bakker'
  },
  {
    id: '4',
    title: 'Innovaties in Prostaatkanker Zorg',
    excerpt: 'Een overzicht van de laatste medische ontwikkelingen en wat deze voor u kunnen betekenen.',
    category: 'Medisch',
    content: 'Medische innovaties...',
    imageUrl: 'https://picsum.photos/id/338/800/600',
    date: '2023-11-12',
    author: 'Prof. Dr. S. Mulder'
  }
];

export const INITIAL_WEIGHT_ENTRIES = [
  { id: '1', date: '2023-10-01', weight: 88.5, note: 'Start meting' },
  { id: '2', date: '2023-10-08', weight: 87.9, note: 'Voelde me goed' },
  { id: '3', date: '2023-10-15', weight: 87.2, note: 'Veel gewandeld' },
  { id: '4', date: '2023-10-22', weight: 86.8 },
  { id: '5', date: '2023-10-29', weight: 86.5 },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq1',
    category: 'Algemeen',
    question: 'Waarom is een applicatie voor afvallen nuttig voor mensen met prostaatkanker?',
    answer: 'Meer dan 14.000 mannen in Nederland krijgen jaarlijks de diagnose prostaatkanker. Onderzoek toont aan dat obesitas geassocieerd wordt met een hogere mortaliteit bij prostaatkanker (Rivera-Izquierdo et al., 2021). Daarnaast beïnvloeden roken en overgewicht zowel de ontstaanskans als de kans op overlijden. Een gezonde leefstijl kan het risico verkleinen en de prognose verbeteren. Het Nederlands Kanker Collectief stelt ook dat bij mensen met gezonde leefstijlpatronen kanker minder vaak terugkomt.'
  },
  {
    id: 'faq2',
    category: 'Behandeling',
    question: 'Wat houdt "Active Surveillance" in en wat kan ik doen?',
    answer: 'Active Surveillance betekent dat behandeling wordt uitgesteld omdat de tumor vaak niet agressief is. U blijft wel onder controle. Dit uitstel is zinvol als u deze tijd gebruikt om uw conditie te optimaliseren. Als de tumor na jaren groeit en behandeling nodig is, is uw lichaam er beter op voorbereid. Het "duurzaam optimaliseren van het gezondheidsprofiel" maakt eventuele toekomstige behandelingen effectiever en logischer.'
  },
  {
    id: 'faq3',
    category: 'Behandeling',
    question: 'Welke invloed heeft overgewicht op een operatie?',
    answer: 'Overgewicht kan een operatie complexer maken. Bij een grote buikomtrek is er minder ruimte om te opereren. Omdat de patiënt tijdens de operatie vaak gekanteld ligt, drukt de buik op de longen, waardoor hogere beademingsdrukken nodig zijn. Daarnaast kan een operatie soms niet doorgaan bij ernstig overgewicht. Afvallen in de periode voor de operatie maakt de ingreep veiliger en het herstel sneller.'
  },
  {
    id: 'faq4',
    category: 'Behandeling',
    question: 'Wat is de relatie tussen leefstijl en narcose?',
    answer: 'U kunt een narcose van 2,5 tot 5 uur zien als een marathon voor uw lichaam. Het herstellen gaat veel sneller als u een goede conditie heeft. Stoppen met roken en afvallen verlaagt het narcoserisico aanzienlijk.'
  },
  {
    id: 'faq5',
    category: 'Hormoontherapie',
    question: 'Hoe helpt leefstijl bij hormoontherapie?',
    answer: 'Hormoontherapie blokkeert testosteron, wat bijwerkingen heeft zoals energieverlies, spierverlies en botontkalking. Mensen die actief zijn en een goede conditie hebben, ervaren minder last van energieverlies en spierverlies. Dagelijks bewegen (zoals wandelen) helpt bovendien botontkalking te voorkomen. Ook verlaagt hormoontherapie het risico op hart- en vaatziekten, dat door overgewicht juist verhoogd zou worden.'
  },
  {
    id: 'faq6',
    category: 'Algemeen',
    question: 'Kan leefstijl helpen bij zwaardere behandelingen zoals chemotherapie?',
    answer: 'Ja. De laatste fase van prostaatkankerbehandeling kan chemotherapie omvatten als hormoontherapie niet meer werkt. Bij patiënten die in de jaren daarvoor aandacht hebben besteed aan hun leefstijl, is de kans veel groter dat ze deze zware therapieën goed kunnen verdragen.'
  }
];

export const CHECKIN_QUESTIONS = [
  { id: 'energy', label: 'Hoe is mijn energieniveau?', minLabel: 'Geen energie', maxLabel: 'Oneindige energie' },
  { id: 'strength', label: 'Hoe sterk voel ik mij?', minLabel: 'Geen kracht', maxLabel: 'Veel kracht' },
  { id: 'hunger', label: 'Hoe gaat het met mijn hongergevoel?', minLabel: 'Veel honger', maxLabel: 'Geen honger' },
  { id: 'mood', label: 'Hoe gaat het met mijn gemoedstoestand?', minLabel: 'Niet goed', maxLabel: 'Heel goed' },
  { id: 'stress', label: 'Hoeveel stress ervaar ik nu?', minLabel: 'Weinig stress', maxLabel: 'Veel stress' },
  { id: 'sleep', label: 'Hoe goed is mijn kwaliteit van slaap?', minLabel: 'Haast geen slaap', maxLabel: 'Heel goede slaap' },
];

export const BADGES: Badge[] = [
  { id: 'b1', title: 'De Eerste Stap', description: 'Maak uw eerste gewichtsmeting aan.', iconName: 'Flag', conditionType: 'weight_entry', threshold: 1 },
  { id: 'b2', title: 'Volhouder', description: 'Registreer 3 dagen achter elkaar uw voortgang.', iconName: 'Flame', conditionType: 'streak', threshold: 3 },
  { id: 'b3', title: 'Weekwinnaar', description: 'Een volledige week aan uw gezondheid gewerkt.', iconName: 'Trophy', conditionType: 'streak', threshold: 7 },
  { id: 'b4', title: 'Reflectie Meester', description: 'Vul 5 keer uw dagelijkse check-in in.', iconName: 'Brain', conditionType: 'checkin', threshold: 5 },
  { id: 'b5', title: 'Waterkoning', description: 'Drink voldoende water (Challenge)', iconName: 'Droplets', conditionType: 'streak', threshold: 14 } // Simulated
];

export const CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Groente Kampioen', description: 'Eet elke dag 200 gram groente.', duration: '7 dagen', participants: 342, category: 'Voeding' },
  { id: 'c2', title: 'Dagelijkse Ommetje', description: 'Wandel 20 minuten per dag.', duration: '30 dagen', participants: 815, category: 'Beweging' },
  { id: 'c3', title: 'Rust in het Hoofd', description: '5 minuten ademhalingsoefeningen.', duration: '14 dagen', participants: 124, category: 'Mentaal' },
];

export const CARE_PATHS = [
  { 
    id: 'active_surveillance', 
    title: 'Active Surveillance', 
    description: 'Controlefase waarin leefstijl kan helpen uitstel van behandeling te verlengen.',
    icon: Activity
  },
  { 
    id: 'treatment_lt_6m', 
    title: 'Behandeling < 6 maanden', 
    description: 'Voorbereiding op operatie of bestraling. Focus op conditieopbouw.',
    icon: Clock
  },
  { 
    id: 'treatment_6_12w', 
    title: 'Behandeling binnen 6-12 weken', 
    description: 'Intensieve, korte termijn voorbereiding voor optimaal herstel.',
    icon: AlertTriangle
  },
  { 
    id: 'high_risk', 
    title: 'High-risk / Complex', 
    description: 'Geavanceerde fase of complicaties. Leefstijl als ondersteuning bij zware therapie.',
    icon: ShieldAlert
  },
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    userPseudonym: 'WandelFan_55',
    actionType: 'challenge_join',
    content: 'Doet mee aan het "Dagelijkse Ommetje"!',
    timestamp: '2023-10-25T10:30:00Z',
    reactions: { heart: 5, muscle: 2, clap: 8 }
  },
  {
    id: 'p2',
    userPseudonym: 'FitNa50',
    actionType: 'streak_milestone',
    content: 'Heeft een reeks van 7 dagen behaald!',
    timestamp: '2023-10-25T09:15:00Z',
    reactions: { heart: 12, muscle: 8, clap: 15 }
  },
  {
    id: 'p3',
    userPseudonym: 'Anonieme Gebruiker',
    actionType: 'badge_earned',
    content: 'Heeft de badge "De Eerste Stap" verdiend.',
    timestamp: '2023-10-24T18:45:00Z',
    reactions: { heart: 3, muscle: 0, clap: 4 }
  },
  {
    id: 'p4',
    userPseudonym: 'GezondEten',
    actionType: 'checkin_complete',
    content: 'Heeft vandaag gereflecteerd op gezondheid.',
    timestamp: '2023-10-24T14:20:00Z',
    reactions: { heart: 6, muscle: 1, clap: 1 }
  }
];
