'use strict';
// Concepts are separate from the assignment’s per-song interpretations (≤ 100 words).
window.HOME_CATALOG.sources.push(
  {id:'un-households',label:'UN Statistics Division · Households and families',url:'https://unstats.un.org/unsd/demographic-social/sconcerns/family/',apa:'United Nations Statistics Division. (n.d.-a). Households and families.',note:'Distinguishes a household’s living arrangements from family relationships.'},
  {id:'un-unions',label:'UN Statistics Division · Marriage and divorce',url:'https://unstats.un.org/unsd/demographic-social/sconcerns/mar_divorce/',apa:'United Nations Statistics Division. (n.d.-b). Marriage and divorce.',note:'Concepts and definitions of marital status, divorce, annulment, and judicial separation.'},
  {id:'prb-glossary',label:'PRB · Demographic terms',url:'https://www.prb.org/resource/glossary/',apa:'Population Reference Bureau. (2020, October 2). Glossary of demographic terms.',note:'Definitions of consensual union and crude marriage and divorce rates.'},
<<<<<<< HEAD
  {id:'life-course',label:'Mortimer · Agency and linked lives',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9350070/',apa:'Mortimer, J. T. (2022). Agency, linked lives, and historical time: Evidence from the longitudinal three generation Youth Development Study. Longitudinal and Life Course Studies, 13(2), 195–216. https://doi.org/10.1332/175795921X16398283564306',note:'Life-course principles; the Minnesota study is conceptual background, not evidence about Philippine separation outcomes.'}
=======
  {id:'life-course',label:'Mortimer · Agency and linked lives',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9350070/',apa:'Mortimer, J. T. (2022). Agency, linked lives and historical time: Evidence from the longitudinal three-generation Youth Development Study. Longitudinal and Life Course Studies, 13(2), 195–216. https://doi.org/10.1332/175795921X16398283564306',note:'Life-course principles; the Minnesota study is conceptual background, not evidence about Philippine separation outcomes.'}
>>>>>>> 0781108 (second commit)
);

window.HOME_CONCEPTS = [
  {
<<<<<<< HEAD
    id:'formation',word:'Pagbuo',title:'Union & household formation',short:'Making a shared life',motif:0,
    definition:'Union formation is the start of a partnership; household formation concerns how people organize where and with whom they live. They can happen together, but they are not the same event.',
    mechanism:'A household may contain one person, relatives, unrelated people, or several family units. Becoming a couple does not establish that two people share an address, are married, or have children.',
    application:'Cornelia Street turns rooms and routines into a shared world. The Apartment We Won’t Share imagines a household that never forms, while Paths revisits plans to marry. Their places across the sequence distinguish a life plan from an observed living arrangement.',
    measure:'Ask who lives together, their relationships to one another, and whether or when a union began. Marital status alone cannot describe the entire household.',
    limit:'A song about an apartment does not prove cohabitation or marriage.',
    prompt:'If two partners live in different homes, are they automatically two people with no union?',
    response:'No. Partnership, shared residence, and legal marital status are separate dimensions. Ask about each before assigning a demographic category.',
    tracks:['cornelia-street','apartment','paths'],sources:['un-households','un-unions']
  },
  {
    id:'cohabitation',word:'Pagsasama',title:'Cohabitation & nuptiality',short:'How partnerships are recorded',motif:1,
    definition:'Cohabitation is living together as partners without being legally married to each other. Nuptiality concerns patterns of marriage formation and dissolution, including their timing.',
    mechanism:'Legal status and everyday arrangements can differ. A census therefore needs categories that reflect local laws and living situations; “living together” does not tell us how a couple divides care or resources.',
    application:'Our shared-home imagery invites a cohabitation reading, but no song is assigned a legal status it does not establish. The theme includes married and unmarried partnerships while keeping their transitions distinct.',
    measure:'PSA recorded the common-law/live-in category at 9.2% in 2015 and 14.7% in 2020 among household population aged 10 and over.',
    limit:'The increase does not identify why people cohabit or show that cohabitation causes later separation.',
    prompt:'Does a breakup between unmarried partners count as a divorce?',
    response:'No. It may end a cohabiting union and reorganize a household, but divorce specifically concerns the legal ending of a marriage.',
    tracks:['cornelia-street','vines'],sources:['prb-glossary','un-unions','psa']
  },
  {
    id:'stability',word:'Pag-aalaga',title:'Union stability & well-being',short:'Staying together, living well',motif:1,
    definition:'Union stability asks whether a partnership continues over time. Relationship quality asks how that partnership is experienced. Duration and well-being answer different questions.',
    mechanism:'Our reading treats apology, communication, and personal limits as part of maintaining a shared life. These are interpretive themes, not a diagnosis or a prediction of whether a particular couple will separate.',
    application:'Vines leaves room for repair. Hallelujah holds affection and disappointment together; Pitseleh turns toward responsibility for hurt. Hit the Wall introduces personal limits, Unti-Unti portrays distance within a continuing union, and True Love Waits voices the sacrifices someone might offer to keep it. Each is a step in the same story of relationship quality and union stability.',
    measure:'A relationship history can record duration and transitions. Understanding well-being would also require appropriate measures of support, conflict, security, and lived experience.',
    limit:'The PSA marital-status table does not measure relationship satisfaction or safety.',
    prompt:'Can a long-lasting union still have poor relationship quality?',
    response:'Yes. A union may continue while partners experience distress. Conversely, conflict in a song does not establish that the partnership will end.',
    tracks:['vines','hit-the-wall','unti-unti','true-love-waits','pitseleh','hallelujah'],sources:['un-unions']
  },
  {
    id:'dissolution',word:'Paglayo',title:'Union dissolution',short:'When a shared life changes',motif:3,
    definition:'Union dissolution is the ending of a partnership. Emotional withdrawal, moving apart, and a legal status change need not occur at the same time.',
    mechanism:'For this playlist, dissolution is a sequence rather than one dramatic goodbye. An unmarried breakup, de facto separation, legal separation, and divorce must still be distinguished when measuring change.',
    application:'Unti-Unti gives the process its gradual pace. Don’t Think Twice, It’s All Right adds ambivalence before Bye Bye Bye makes leaving a decision. The Apartment We Won’t Share grieves the planned future, you were good to me brings gratitude and regret, and Paalam says farewell. This sequence is our interpretation, not a documented history of one couple.',
    measure:'Ask when a union ended and what changed in residence or legal status. PSA’s combined divorced/separated/annulled category cannot distinguish those separate experiences.',
    limit:'A higher census share is not the annual chance that a marriage will end.',
    prompt:'If partners move apart today but their legal status changes later, which date matters?',
    response:'It depends on the research question. Residential separation and legal dissolution have different dates, so a careful study specifies the event being counted.',
    tracks:['unti-unti','bye-bye-bye','apartment','dont-think-twice','you-were-good','paalam'],sources:['un-unions','psa']
  },
  {
    id:'life-course',word:'Pagpili',title:'Life course & agency',short:'Choices within circumstances',motif:5,
    definition:'The life-course perspective follows lives through time. Agency means people make choices and act, within opportunities and constraints shaped by their circumstances.',
    mechanism:'Timing matters in our reading: a departure during schooling, parenting, or later life may raise different practical questions. Resources, responsibilities, social expectations, and legal options frame what a fresh start can involve.',
    application:'Bye Bye Bye expresses a decision to leave. Paths imagines a different trajectory; 2 MINUS 1 captures the uneven experience of moving on. These perspectives let us discuss agency without assuming everyone has equal choices.',
    measure:'A sequence of union, residence, work, and care histories would show timing and order. A single census snapshot cannot reconstruct an individual’s entire pathway.',
    limit:'These are applications of life-course ideas; the background study is not a Philippine divorce-policy evaluation.',
    prompt:'Does describing leaving as a choice mean that leaving is equally easy for everyone?',
    response:'No. Agency operates within circumstances. Discuss money, housing, responsibilities, and available support alongside the decision itself.',
    tracks:['bye-bye-bye','paths','2-minus-1','dont-think-twice'],sources:['life-course']
  },
  {
    id:'linked-lives',word:'Ugnayan',title:'Linked lives & repartnering',short:'Separate homes, connected histories',motif:0,
    definition:'Linked lives means that people’s pathways are interdependent. Repartnering is entering a new partnership after an earlier one ends; it does not necessarily mean remarriage.',
    mechanism:'Our discussion asks what continues after a union changes: memories, kin relationships, or responsibilities where these exist. A person’s new chapter can remain connected to other people’s biographies.',
    application:'You’re Gonna Live Forever in Me places an earlier relationship beside another possible union. Paalam makes room for farewell; Hallelujah holds affection and contradiction together. Emotional continuity and living together are different dimensions.',
    measure:'Ask about previous unions, new partners, shared children where relevant, and relationships across homes. Current marital status alone can hide earlier transitions.',
    limit:'The songs do not establish that any narrator has children or a particular legal obligation.',
    prompt:'Does starting a new union erase the demographic relevance of an earlier one?',
    response:'No. Earlier unions remain part of a life history. New residence and relationship arrangements can coexist with past connections.',
    tracks:['live-forever','paalam','hallelujah','true-love-waits'],sources:['life-course','un-households']
  },
  {
    id:'reorganization',word:'Pag-usbong',title:'Household reorganization',short:'The practical side of beginning again',motif:4,
    definition:'Household reorganization describes changes in who lives together and how everyday life is arranged after a transition. A breakup can change a living arrangement without changing the total population.',
    mechanism:'Our theme raises questions about housing, income, daily routines, and care. Partners might form separate homes or join an existing household; the number and size of households therefore need not change in one predictable way.',
    application:'The Apartment We Won’t Share makes an imagined home disappear. Water the Roses gives rebuilding a metaphor of care and growth. Paalam adds the emotional work of accepting life after a relationship.',
    measure:'Compare household membership before and after a transition, with information on living arrangements and resources. Count people and households separately.',
    limit:'Renewal in the playlist is an interpretive ending, not a claim that separation always improves well-being.',
    prompt:'If a couple separates, must the number of households increase by one?',
    response:'No. One or both people could join relatives or another existing household. The result depends on where they live next.',
    tracks:['paalam-silent-sanctuary','apartment','water-the-roses','paalam','2-minus-1','you-were-good'],sources:['un-households']
  },
  {
    id:'measurement',word:'Pagbilang',title:'Population stock, flow & composition',short:'Read the number before the argument',motif:2,
    definition:'A stock describes a population at a point in time. A flow counts events during a period. Composition describes who is represented within a population category.',
    mechanism:'A census share can change through entries, exits, aging, deaths, migration, or reporting changes. Comparing two snapshots does not identify each person’s transition or isolate a single cause.',
    application:'The songs give a human-scale interpretation; the census supplies a different kind of evidence. Keeping those roles distinct makes our argument for dignity and support more careful.',
    measure:'PSA’s combined category rose from 1.5% to 1.9%: +0.4 percentage points. A crude divorce rate instead counts divorces per 1,000 people in a specified year. Women’s 60.1% share within the combined category has a different denominator.',
    limit:'The table cannot isolate divorce prevalence, an annual divorce rate, causation, or which group experiences the most harm.',
    prompt:'If 60.1% of a recorded category are women, does that mean 60.1% of all women are in that category?',
    response:'No. The denominator is everyone in the combined category. The within-sex figure in 2020 was 2.3% of women, compared with 1.5% of men.',
    tracks:[],sources:['psa','prb-glossary']
  }
];

// Concept links follow the same listening order as every other part of the site.
window.HOME_CONCEPTS.forEach(concept => {
  concept.tracks.sort((a,b)=>window.HOME_CATALOG.tracks.findIndex(t=>t.id===a)-window.HOME_CATALOG.tracks.findIndex(t=>t.id===b));
=======
    "id": "formation",
    "word": "Pagbuo",
    "title": "Union & household formation",
    "short": "Making a shared life",
    "motif": 0,
    "definition": "Union formation is the start of a partnership; household formation concerns how people organize where and with whom they live. They can happen together, but they are not the same event.",
    "mechanism": "A household may contain one person, relatives, unrelated people, or several family units. Becoming a couple does not establish that two people share an address, are married, or have children.",
    "application": "Cornelia Street turns rooms and routines into a shared world. The Apartment We Won’t Share imagines a household that never forms, while Paths revisits plans to marry. Their places across the sequence distinguish a life plan from an observed living arrangement.",
    "measure": "Ask who lives together, their relationships to one another, and whether or when a union began. Marital status alone cannot describe the entire household.",
    "limit": "A song about an apartment does not prove cohabitation or marriage.",
    "prompt": "If two partners live in different homes, are they automatically two people with no union?",
    "response": "No. Partnership, shared residence, and legal marital status are separate dimensions. Ask about each before assigning a demographic category.",
    "tracks": [
      "cornelia-street",
      "apartment",
      "paths"
    ],
    "sources": [
      "un-households",
      "un-unions"
    ]
  },
  {
    "id": "cohabitation",
    "word": "Pagsasama",
    "title": "Cohabitation & nuptiality",
    "short": "How partnerships are recorded",
    "motif": 1,
    "definition": "Cohabitation is living together as partners without being legally married to each other. Nuptiality concerns patterns of marriage formation and dissolution, including their timing.",
    "mechanism": "Legal status and everyday arrangements can differ. A census therefore needs categories that reflect local laws and living situations; “living together” does not tell us how a couple divides care or resources.",
    "application": "Our shared-home imagery invites a cohabitation reading, but no song is assigned a legal status it does not establish. The theme includes married and unmarried partnerships while keeping their transitions distinct.",
    "measure": "PSA recorded the common-law/live-in category at 9.2% in 2015 and 14.7% in 2020 among household population aged 10 and over.",
    "limit": "The increase does not identify why people cohabit or show that cohabitation causes later separation.",
    "prompt": "Does a breakup between unmarried partners count as a divorce?",
    "response": "No. It may end a cohabiting union and reorganize a household, but divorce specifically concerns the legal ending of a marriage.",
    "tracks": [
      "cornelia-street",
      "vines"
    ],
    "sources": [
      "prb-glossary",
      "un-unions",
      "psa"
    ]
  },
  {
    "id": "stability",
    "word": "Pag-aalaga",
    "title": "Union stability & well-being",
    "short": "Staying together, living well",
    "motif": 1,
    "definition": "Union stability asks whether a partnership continues over time. Relationship quality asks how that partnership is experienced. Duration and well-being answer different questions.",
    "mechanism": "Our reading treats apology, communication, and personal limits as part of maintaining a shared life. These are interpretive themes, not a diagnosis or a prediction of whether a particular couple will separate.",
    "application": "Vines leaves room for apology and repair. Hit the Wall introduces personal limits, Unti-Unti portrays distance within a continuing union, and True Love Waits voices what someone might offer to keep it. We use these contrasting perspectives to distinguish a union’s continuity from its quality.",
    "measure": "A relationship history can record duration and transitions. Understanding well-being would also require appropriate measures of support, conflict, security, and lived experience.",
    "limit": "The PSA marital-status table does not measure relationship satisfaction or safety.",
    "prompt": "Can a long-lasting union still have poor relationship quality?",
    "response": "Yes. A union may continue while partners experience distress. Conversely, conflict in a song does not establish that the partnership will end.",
    "tracks": [
      "vines",
      "hit-the-wall",
      "unti-unti",
      "true-love-waits"
    ],
    "sources": [
      "un-unions"
    ]
  },
  {
    "id": "dissolution",
    "word": "Paglayo",
    "title": "Union dissolution",
    "short": "When a shared life changes",
    "motif": 3,
    "definition": "Union dissolution is the ending of a partnership. Emotional withdrawal, moving apart, and a legal status change need not occur at the same time.",
    "mechanism": "For this playlist, dissolution is a sequence rather than one dramatic goodbye. An unmarried breakup, de facto separation, legal separation, and divorce must still be distinguished when measuring change.",
    "application": "Unti-Unti gives emotional withdrawal a gradual pace. Don’t Think Twice, It’s All Right holds hesitation beside departure. The Apartment We Won’t Share grieves the planned future. Their sequence is our interpretation of a process; Mika and Eli’s script supplies the fictional case.",
    "measure": "Ask when a union ended and what changed in residence or legal status. PSA’s combined divorced/separated/annulled category cannot distinguish those separate experiences.",
    "limit": "A higher census share is not the annual chance that a marriage will end.",
    "prompt": "If partners move apart today but their legal status changes later, which date matters?",
    "response": "It depends on the research question. Residential separation and legal dissolution have different dates, so a careful study specifies the event being counted.",
    "tracks": [
      "unti-unti",
      "dont-think-twice",
      "apartment"
    ],
    "sources": [
      "un-unions",
      "psa"
    ]
  },
  {
    "id": "life-course",
    "word": "Pagpili",
    "title": "Life course & agency",
    "short": "Choices within circumstances",
    "motif": 5,
    "definition": "The life-course perspective follows lives through time. Agency means people make choices and act, within opportunities and constraints shaped by their circumstances.",
    "mechanism": "Timing matters in our reading: a departure during schooling, parenting, or later life may raise different practical questions. Resources, responsibilities, social expectations, and legal options frame what a fresh start can involve.",
    "application": "Mika and Eli’s ideas of work, marriage, parenthood, and place do not fit the same timeline. Don’t Think Twice, It’s All Right gives leaving a voice; Paths revisits a life that could have unfolded differently. These readings connect choice to timing and circumstance.",
    "measure": "A sequence of union, residence, work, and care histories would show timing and order. A single census snapshot cannot reconstruct an individual’s entire pathway.",
    "limit": "These are applications of life-course ideas; the background study is not a Philippine divorce-policy evaluation.",
    "prompt": "Does describing leaving as a choice mean that leaving is equally easy for everyone?",
    "response": "No. Agency operates within circumstances. Discuss money, housing, responsibilities, and available support alongside the decision itself.",
    "tracks": [
      "dont-think-twice",
      "paths"
    ],
    "sources": [
      "life-course"
    ]
  },
  {
    "id": "linked-lives",
    "word": "Ugnayan",
    "title": "Linked lives & support networks",
    "short": "Separate homes, connected lives",
    "motif": 0,
    "definition": "Linked lives means that people’s pathways are interdependent. Support networks include relatives and other people whose care, housing, or resources can shape a transition.",
    "mechanism": "Our discussion asks what continues after a union changes: memories, kin relationships, or responsibilities where these exist. A person’s new chapter can remain connected to other people’s biographies.",
    "application": "True Love Waits voices attachment to another person. Paths keeps an earlier relationship in memory after plans change. In the skit, a brother, a cousin, and Mika’s family also shape what each person can do next. Connection can continue after shared residence ends.",
    "measure": "Ask about previous unions, new partners, shared children where relevant, and relationships across homes. Current marital status alone can hide earlier transitions.",
    "limit": "The songs do not establish that any narrator has children or a particular legal obligation.",
    "prompt": "Does living apart erase the influence of other people on a life course?",
    "response": "No. Former partners, relatives, friends, and work connections may continue to influence opportunities and responsibilities. Those links need not mean that a couple resumes its union.",
    "tracks": [
      "true-love-waits",
      "paths"
    ],
    "sources": [
      "life-course",
      "un-households"
    ]
  },
  {
    "id": "reorganization",
    "word": "Pag-usbong",
    "title": "Household reorganization",
    "short": "The practical side of beginning again",
    "motif": 4,
    "definition": "Household reorganization describes changes in who lives together and how everyday life is arranged after a transition. A breakup can change a living arrangement without changing the total population.",
    "mechanism": "Our theme raises questions about housing, income, daily routines, and care. Partners might form separate homes or join an existing household; the number and size of households therefore need not change in one predictable way.",
    "application": "The Apartment We Won’t Share releases an imagined shared home. In our skit, the returned key, final bills, divided deposit, and moves into relatives’ homes show the practical changes. Paths reminds us that emotional adjustment can continue after those residential changes.",
    "measure": "Compare household membership before and after a transition, with information on living arrangements and resources. Count people and households separately.",
    "limit": "Renewal in the playlist is an interpretive ending, not a claim that separation always improves well-being.",
    "prompt": "If a couple separates, must the number of households increase by one?",
    "response": "No. One or both people could join relatives or another existing household. The result depends on where they live next.",
    "tracks": [
      "apartment",
      "paths"
    ],
    "sources": [
      "un-households"
    ]
  },
  {
    "id": "measurement",
    "word": "Pagbilang",
    "title": "Population stock, flow & composition",
    "short": "Read the number before the argument",
    "motif": 2,
    "definition": "A stock describes a population at a point in time. A flow counts events during a period. Composition describes who is represented within a population category.",
    "mechanism": "A census share can change through entries, exits, aging, deaths, migration, or reporting changes. Comparing two snapshots does not identify each person’s transition or isolate a single cause.",
    "application": "The songs give a human-scale interpretation; the census supplies a different kind of evidence. Keeping those roles distinct makes our argument for dignity and support more careful.",
    "measure": "PSA’s combined category rose from 1.5% to 1.9%: +0.4 percentage points. A crude divorce rate instead counts divorces during a specified year per 1,000 people; this is the OECD indicator’s denominator. Women’s 60.1% share within the combined category has a different denominator.",
    "limit": "The table cannot isolate divorce prevalence, an annual divorce rate, causation, or which group experiences the most harm.",
    "prompt": "If 60.1% of a recorded category are women, does that mean 60.1% of all women are in that category?",
    "response": "No. The denominator is everyone in the combined category. The within-sex figure in 2020 was 2.3% of women, compared with 1.5% of men.",
    "tracks": [],
    "sources": [
      "psa",
      "prb-glossary",
      "oecd-rates"
    ]
  }
];

// APA typography for standalone pages and the journal/volume title.
window.HOME_CATALOG.sources.forEach(s=>{
 const titles={'un-households':'Households and families','un-unions':'Marriage and divorce','prb-glossary':'Glossary of demographic terms'};
 if(titles[s.id])s.apaTitle=titles[s.id];
 if(s.id==='life-course')s.apaJournal='Longitudinal and Life Course Studies, 13';
>>>>>>> 0781108 (second commit)
});
