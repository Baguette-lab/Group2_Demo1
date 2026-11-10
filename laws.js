'use strict';
// Educational context for our demographic story. Each rule keeps its jurisdiction.
window.HOME_LEGAL = {
  checked: 'November 5, 2026',
  note: 'There is no single worldwide divorce procedure. National rules, special legal routes, and international rights principles have different scopes. These are selected examples for class discussion, not an assessment of anyone’s eligibility.',
  scopes: [
    {
      id: 'ph', label: 'Philippine law', word: 'Dito sa atin',
      title: 'Different routes. Different legal effects.',
      intro: 'Begin with the union and the law that governs it. Living apart, ending a marriage, and recognizing a foreign decree are distinct transitions. A proposed bill is a separate category.',
      cards: [
        {
          id: 'legal-separation', jurisdiction: 'PHILIPPINES', status: 'Enacted law', type: 'law',
          title: 'Legal separation', basis: 'Family Code · Articles 55 & 63',
          result: 'Spouses may live separately; the marriage bond remains.',
          detail: 'Article 55 sets legal grounds. A decree under Article 63 does not dissolve the marriage, so it does not by itself permit remarriage. Living apart informally is different from obtaining that decree.',
          lens: 'A changed address or household does not necessarily mean a changed legal marital status.',
          tracks: ['unti-unti', 'apartment'], sources: ['family-code']
        },
        {
          id: 'annulment-nullity', jurisdiction: 'PHILIPPINES', status: 'Enacted law', type: 'law',
          title: 'Annulment & declaration of nullity', basis: 'Family Code · Articles 35–36 & 45',
          result: 'The legal question concerns the marriage’s validity.',
          detail: 'Annulment concerns a voidable marriage on grounds existing when it was celebrated (Art. 45). Nullity concerns a marriage void from the beginning (Arts. 35–36). These differ from divorce ending a valid marriage; later unhappiness alone does not establish these grounds.',
          lens: 'Keep distinct legal events distinct, even when a census combines them in one reported category.',
          tracks: ['hit-the-wall', 'paths'], sources: ['family-code']
        },
        {
          id: 'muslim-divorce', jurisdiction: 'PHILIPPINES · COVERED MUSLIM MARRIAGES', status: 'Special-law route', type: 'law',
          title: 'Divorce under Muslim personal law', basis: 'Presidential Decree No. 1083 · Articles 13 & 45–55',
          result: 'Philippine law provides divorce within this Code’s scope.',
          detail: 'Article 13 defines which marriages the title covers. Articles 45–55 provide forms of divorce and their effects, with their own requirements. This is an existing Philippine legal route, not a general procedure for every marriage in the country.',
          lens: 'A country’s population may include groups governed by different family-law frameworks.',
          tracks: [], sources: ['ph-muslim-code']
        },
        {
          id: 'foreign-recognition', jurisdiction: 'PHILIPPINES · QUALIFYING FOREIGN DIVORCES', status: 'Law & court guidance', type: 'law',
          title: 'Recognition of a foreign divorce', basis: 'Family Code · Article 26(2), as amended',
          result: 'A foreign decree can have Philippine effects in qualifying cases.',
          detail: 'Article 26(2) concerns qualifying divorces involving a Filipino and a foreign spouse. Judicial recognition in the Philippines is still required. Supreme Court case law explains that the fact of the divorce and the applicable foreign law must be proved for judicial recognition.',
          lens: 'Migration and cross-border families connect more than one legal system; going abroad is not an automatic route for every Filipino couple.',
          tracks: [], sources: ['family-code', 'ph-foreign-divorce']
        },
        {
          id: 'divorce-proposal', jurisdiction: 'PHILIPPINES · 20TH CONGRESS', status: 'Filed bill · verify current legislative history', type: 'proposal',
          title: 'The divorce-policy debate', basis: 'Senate Bill No. 394 · Dissolution of Marriage Act',
          result: 'A bill describes a proposed change, not an available remedy.',
          detail: 'Filed July 10, 2025, S.B. 394 proposes expanded dissolution grounds and divorce procedures. We discuss this filed bill as a proposal, rather than proof of an available general divorce remedy. Consult the linked legislative history for its current progress.',
          lens: 'Our support for divorce as an option is the group’s policy position. It must be distinguished from what an enacted statute currently provides.',
          tracks: ['paalam', 'water-the-roses'], sources: ['ph-divorce-bill']
        }
      ]
    },
    {
      id: 'abroad', label: 'Examples abroad', word: 'Sa ibang tahanan',
      title: 'How two other jurisdictions handle it.',
      intro: 'These examples illustrate different approaches to a marriage’s end. They do not represent every country or establish rules for Philippine cases.',
      cards: [
        {
          id: 'england-wales', jurisdiction: 'ENGLAND & WALES', status: 'Enacted law & official guidance', type: 'law',
          title: 'Divorce without assigning blame', basis: 'Divorce, Dissolution and Separation Act 2020 · in operation since April 6, 2022',
          result: 'A sole or joint application can state irretrievable breakdown.',
          detail: 'The no-fault framework removes the need to allege a spouse’s misconduct. Ordinarily there are 20 weeks from issue before a conditional order can be sought, then at least 6 weeks and 1 day before applying for a final order. These are minimum stages, not a guaranteed completion time.',
          lens: 'Ending legal status and arranging children, money, and housing are connected but distinct tasks. This example is England and Wales; Scotland and Northern Ireland have different procedures.',
          tracks: ['dont-think-twice', 'paalam'], sources: ['ew-divorce-act', 'ew-apply', 'ew-final']
        },
        {
          id: 'australia', jurisdiction: 'AUSTRALIA', status: 'Law explained by the court', type: 'law',
          title: 'Separation can happen under one roof', basis: 'Family Law Act 1975 · court guidance on no-fault divorce',
          result: 'Separation, rather than blame, establishes breakdown.',
          detail: 'The court’s filing guidance requires separation for at least 12 months and 1 day, alongside jurisdictional eligibility. Partners may be separated while sharing a home, with extra evidence. A divorce order does not itself decide property, maintenance, or parenting arrangements.',
          lens: 'This makes the distinction between a shared residence, an ongoing partnership, and legal marital status especially visible.',
          tracks: ['unti-unti', 'apartment'], sources: ['au-divorce', 'au-apply']
        }
      ]
    },
    {
      id: 'international', label: 'International principles', word: 'Karapatan at dignidad',
      title: 'Shared rights. Different national procedures.',
      intro: 'International instruments provide rights standards. They do not create one worldwide form, waiting period, or court for divorce.',
      cards: [
        {
          id: 'udhr', jurisdiction: 'INTERNATIONAL · HUMAN-RIGHTS DECLARATION', status: 'Declaration · not a divorce code', type: 'principle',
          title: 'Consent & equality', basis: 'Universal Declaration of Human Rights · Article 16',
          result: 'Equal rights apply at marriage, during it, and at its dissolution.',
          detail: 'Article 16 also affirms free and full consent to marriage. The UDHR is a declaration, not a treaty or a country’s divorce statute. It supplies a rights lens; it does not specify local grounds or filing procedures.',
          lens: 'We use this principle to discuss dignity and mutual choice, rather than treating a song’s goodbye as a legal judgment.',
          tracks: ['vines', 'paalam'], sources: ['udhr']
        },
        {
          id: 'cedaw', jurisdiction: 'INTERNATIONAL · STATES PARTIES TO THE TREATY', status: 'Treaty obligation', type: 'principle',
          title: 'Equality in family relations', basis: 'CEDAW · Article 16(1)(c)–(d)',
          result: 'States parties must address discrimination in marriage and family relations.',
          detail: 'Article 16 calls for equal rights and responsibilities during marriage and its dissolution, and as parents regardless of marital status, with children’s interests paramount. CEDAW is a treaty for states parties; it does not prescribe a uniform divorce application or timetable.',
          lens: 'The discussion must include care, resources, and responsibilities after separation, alongside the possibility of beginning again.',
          tracks: ['water-the-roses', 'paalam'], sources: ['cedaw']
        }
      ]
    }
  ]
};

// Keep all references in the existing, alphabetized APA-style bibliography.
const familyCodeSource = window.HOME_CATALOG.sources.find(s => s.id === 'family-code');
if (familyCodeSource) Object.assign(familyCodeSource, {
  label: 'PH · Family Code',
  url: 'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/5/95173',
  apa: 'Republic of the Philippines. (1987, July 6). Executive Order No. 209: The Family Code of the Philippines (Arts. 26[2], 35–36, 45, 55, 63; as amended). Supreme Court E-Library.',
  note: 'Scoped Philippine legal context. Annulment, nullity, legal separation, and recognition of qualifying foreign divorces have different grounds and effects.'
});
window.HOME_CATALOG.sources.push(
  {id:'ph-muslim-code',label:'PH · Code of Muslim Personal Laws',url:'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/26/54047',apa:'Republic of the Philippines. (1977, February 4). Presidential Decree No. 1083: Code of Muslim Personal Laws of the Philippines (Arts. 13, 45–55). Supreme Court E-Library.'},
  {id:'ph-foreign-divorce',label:'PH Supreme Court · Foreign-divorce framework',url:'https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/1/68499',apa:'Supreme Court of the Philippines. (2022). Republic of the Philippines v. Bayog-Saito, G.R. No. 247297.'},
  {id:'ph-divorce-bill',label:'PH Senate · S.B. 394 legislative record',url:'https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=20&q=SBN-394',apa:'Senate of the Philippines. (2025). Senate Bill No. 394: Dissolution of Marriage Act (20th Congress) [Bill and legislative history]. Retrieved November 4, 2026, from'},
  {id:'ew-divorce-act',label:'England & Wales · 2020 Act',url:'https://www.legislation.gov.uk/ukpga/2020/11?view=plain',apa:'United Kingdom. (2020). Divorce, Dissolution and Separation Act 2020 (c. 11).'},
  {id:'ew-apply',label:'GOV.UK · Application & conditional order',url:'https://www.gov.uk/divorce/what-happens-after-you-apply',apa:'HM Courts & Tribunals Service. (n.d.-b). Get a divorce: What happens after you apply. GOV.UK. Retrieved November 4, 2026, from'},
  {id:'ew-final',label:'GOV.UK · Final order',url:'https://www.gov.uk/divorce/finalise-your-divorce',apa:'HM Courts & Tribunals Service. (n.d.-a). Get a divorce: Finalise your divorce. GOV.UK. Retrieved November 4, 2026, from'},
  {id:'au-divorce',label:'Australian court · Divorce overview',url:'https://www.fcfcoa.gov.au/fl/divorce/divorce-overview',apa:'Federal Circuit and Family Court of Australia. (n.d.-a). Divorce: Overview. Retrieved November 4, 2026, from'},
  {id:'au-apply',label:'Australian court · Filing & separation',url:'https://www.fcfcoa.gov.au/fl/divorce/apply',apa:'Federal Circuit and Family Court of Australia. (n.d.-b). How do I apply for divorce? Retrieved November 4, 2026, from'},
  {id:'udhr',label:'United Nations · UDHR, Article 16',url:'https://www.un.org/en/about-us/universal-declaration-of-human-rights/',apa:'United Nations. (1948, December 10). Universal Declaration of Human Rights (Art. 16).'},
  {id:'cedaw',label:'United Nations · CEDAW, Article 16',url:'https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-elimination-all-forms-discrimination-against-women',apa:'United Nations. (1979, December 18). Convention on the Elimination of All Forms of Discrimination against Women (Art. 16). Office of the United Nations High Commissioner for Human Rights.'}
);

// Explicit titles keep abbreviations and question marks intact in APA styling.
const legalReferenceTitles = {
  'family-code': 'Executive Order No. 209: The Family Code of the Philippines',
  'ph-muslim-code': 'Presidential Decree No. 1083: Code of Muslim Personal Laws of the Philippines',
  'ph-foreign-divorce': 'Republic of the Philippines v. Bayog-Saito',
  'ph-divorce-bill': 'Senate Bill No. 394: Dissolution of Marriage Act',
  'ew-divorce-act': 'Divorce, Dissolution and Separation Act 2020',
  'ew-apply': 'Get a divorce: What happens after you apply',
  'ew-final': 'Get a divorce: Finalise your divorce',
  'au-divorce': 'Divorce: Overview',
  'au-apply': 'How do I apply for divorce?',
  'udhr': 'Universal Declaration of Human Rights',
  'cedaw': 'Convention on the Elimination of All Forms of Discrimination against Women'
};
window.HOME_CATALOG.sources.forEach(s => {
  if (legalReferenceTitles[s.id]) s.apaTitle = legalReferenceTitles[s.id];
});
