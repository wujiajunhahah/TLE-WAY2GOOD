// Single source of truth for both locales.
// Copy is written by hand from two sources: the 3-page PPT (target user / gap / opportunity)
// and the 8-page market & competitive PDF (market size, competitor gaps, empathy map, HMW).
// Rule: every factual claim here must be traceable to those two files. Nothing invented.

// Only links we actually verified are clickable; the USDA FAS report stays plain text
// rather than inventing a URL.
export const sourceLinks = {
  zh: '（<a href="https://kpmg.com/cn/zh/insights/2025/06/2025-china-pet-industry-market-report.html" rel="noopener">查看 KPMG 报告</a>）',
  en: ' (<a href="https://kpmg.com/cn/zh/insights/2025/06/2025-china-pet-industry-market-report.html" rel="noopener">see the KPMG report</a>)'
};

export const content = {
  zh: {
    lang: 'zh-CN',
    sourceNote: '数据来源：USDA FAS《Pet Food Market Update 2026》；KPMG《2025 中国宠物行业市场报告》',
    title: '看得见它，不等于陪到它 | Pet Companionship 宠物远程陪伴',
    desc: '摄像头能让你看见宠物，却接不住陪伴。这是一个早期研究项目：我们在探索让连接从两边发生的远程陪伴方式。订阅研究、原型与体验招募进展。',
    ogLocale: 'zh_CN',
    ogLocaleAlt: 'en_US',
    skip: '跳到正文',
    brandLine: '宠物远程陪伴',
    brandNote: '早期研究项目',
    nav: '主要导航',
    navGap: '问题',
    navTurn: '机会',
    navUsers: '为谁设计',
    navCta: '订阅进展',
    langSwitch: 'EN',
    langSwitchLabel: 'Read this page in English',

    eyebrow: '宠物远程陪伴 · 早期研究 · 2026',
    h1: '看得见它，<br>不等于<em>陪到它</em>。',
    lede: '摄像头能告诉你它在哪里、在做什么。<br>但你想知道的其实是另一件事——你的回应，它收到了吗？',
    stage: '研究与概念探索阶段 · 目前没有可购买的产品',
    ctaPrimary: '订阅项目进展',
    ctaQuiet: '从五个时刻看起',
    heroAlt: '猫把脸贴向主人，两者之间有一条细线',
    petAlt: '一只猫的线稿：它的尾巴延伸成一条线，连到主人的位置，线上有来回移动的光点。',
    petCap: '它的尾巴，就是我们想补上的那条连接线。',

    factsLabel: '这件事有多大',
    facts: [
      { value: '312.6', unit: '亿元', text: '2025 年中国城镇犬猫消费市场规模，同比 +4.1%' },
      { value: '1.26', unit: '亿只', text: '2025 年城镇犬猫数量，猫的数量与增速均领先' },
      { value: '90 后', unit: '为主', text: '最大养宠人群；00 后增长最快，对数字功能期待更高' }
    ],

    gapLabel: '01 / 我们关注的问题',
    gapTitle: '技术让我们看见它，<br>却没有解决陪伴。',
    gapIntro: '每一天都在发生这样五个时刻。前四步都成立，第五步之后，连接就暂停了。',
    steps: [
      { n: '01', t: '主人离家', d: '工作 / 出差 / 旅行' },
      { n: '02', t: '想念与担心', d: '“它现在在干嘛？”' },
      { n: '03', t: '打开摄像头', d: '主动去寻找它' },
      { n: '04', t: '单向互动', d: '看它 / 说话 / 投喂' },
      { n: '05', t: '再次断开', d: '关掉设备，关系暂停', isBreak: true }
    ],
    breakLabel: '关键断点',
    breakText: '每一次连接，都要先由你「想起它」才能开始。<br>而它，没有办法主动找到你。',
    awayCaption: '你在这边，它在那边。',

    marketLabel: '02 / 现有方案',
    marketTitle: '能看见、能说话、能投喂。<br>然后呢？',
    marketIntro: '我们看了 5 款代表产品，价格从 $56 到 $199。它们在「监控」和「玩具」两端都做得不错，但都停在同一个地方。',
    devicesAlt: '三类代表形态：固定摄像头、移动机器人、智能玩具',
    devicesCaption: '三类形态：固定摄像头 · 移动机器人 · 智能玩具',
    hasTitle: '现在已经做到',
    has: ['看见它在做什么', '听到你说话', '远程投喂或逗它玩', '给你片刻安心'],
    lacksTitle: '仍然缺的是',
    lacks: ['互动几乎都由主人发起', '它无法主动联系你', '关掉画面，连接就结束', '情感支持是碎片化的'],
    productsHead: ['产品', '形态与价格', '主要缺口'],
    products: [
      { name: 'Furbo 360°', form: '固定摄像头 · $119', gap: '位置固定；智能提醒需要订阅' },
      { name: 'Petcube Bites 2', form: '固定摄像头 · $169', gap: '不能平移俯仰；历史与提醒需订阅' },
      { name: 'Enabot ROLA PetPal', form: '移动机器人 · 起价 $199', gap: '体积与噪音；触感有限' },
      { name: 'PETKIT YumShare', form: '喂食器 + 摄像头 · $119.99', gap: '主要解决喂食这一件事' },
      { name: 'Cheerble Wickedbone Air', form: '智能玩具 · $56.09', gap: '没有监控，也没有双向情感回应' }
    ],
    productsNote: '监测类产品减少不确定，但宠物只在主人在线时才真正互动；机器人玩具提升参与感，却和监控、触感、长期关系彼此分离。',

    usersLabel: '03 / 为谁设计',
    usersTitle: '不是所有养宠人。',
    usersIntro: '而是那些和它关系很深、却经常不在同一个空间的人。',
    users: [
      { t: '城市上班族', d: '白天长时间不在家' },
      { t: '频繁出差或短途旅行的人', d: '有规律性的分离' },
      { t: '独居、与它关系很强的人', d: '它是重要的陪伴来源' }
    ],
    usersTrait: '共同点：它不再只是宠物，是家人。但日常生活让你们没法始终待在同一个空间。',

    turnLabel: '04 / 设计机会',
    turnTitle: '从远程监控，<br>到远程陪伴。',
    currentTitle: '现在',
    currentSub: 'Remote Monitoring',
    currentChain: ['主人', '摄像头', '宠物'],
    currentCap: '连接由主人发起，也由主人结束。',
    currentPoints: [
      { t: '看它在做什么', d: '画面告诉你它在哪里，但不知道它怎么想' },
      { t: '主人主动说话', d: '叫它一声，回应取决于它当时在不在' },
      { t: '主人主动投喂或逗它', d: '互动由你发起，也由你决定何时结束' },
      { t: '互动结束后再次断开', d: '关掉画面，连接就停在这一刻' }
    ],
    nextTitle: '机会',
    nextSub: 'Remote Companionship',
    nextChain: ['主人', '设备与 AI', '宠物'],
    nextCap: '连接可以从任一侧开始。',
    nextPoints: [
      { t: '让它也能主动靠近', d: '从它的自然行为出发，给它一个发起连接的入口' },
      { t: '让想念有回应', d: '把「我有点想它」变成一次真实的互动' },
      { t: '不必一直在线', d: '不需要你盯着屏幕，也能给出有意义的回应' },
      { t: '从瞬间到关系', d: '让陪伴不随着关掉画面而结束' }
    ],

    principlesLabel: '06 / 设计原则',
    hmwLabel: '我们要回答的问题',
    hmw: '当主人无法陪伴宠物时，<br>如何让人与宠物之间的情感连接，<br>依然能自然地发生？',
    principles: [
      { t: '明察', e: 'Informed', d: '用简单、安心的方式知道它好不好' },
      { t: '相连', e: 'Connected', d: '即使不在一起，也能感到有意义的双向连接' },
      { t: '尊重', e: 'Respectful', d: '顺着它的天性，不打扰它的休息' },
      { t: '支持', e: 'Supportive', d: '融进你的生活，而不增加负担' }
    ],

    directionsLabel: '07 / 探索方向',
    directionsTitle: '我们正在验证的四件事。',
    directions: [
      { n: '01', t: '它也能主动发起', d: '顺着它的自然行为，设计一个能被它触发的连接入口' },
      { n: '02', t: '轻量的双向回应', d: '不需要你一直盯着屏幕，也不频繁打扰它' },
      { n: '03', t: '留下共享的日常', d: '不止于实时画面，而是能被回看的片段' },
      { n: '04', t: '持续的关系', d: '从一次互动，走向长期的情感连接' }
    ],
    netLabel: '连接方向',
    netNow: '现在 · 单向',
    netNext: '机会 · 双向',
    netAlt: '示意图：现在连接由主人单方向发起；机会是主人与宠物之间双向、由设备与 AI 承接的连接。',
    conceptLabel: '05 / 概念示意',
    conceptTitle: '如果它也能先找你，<br>那一刻会是什么样？',
    conceptNote: '下面是交互概念草图，用来说明方向。不是可用的产品，也不是真实界面。',
    conceptTag: '概念稿',
    concepts: [
      { glyph: 'signal', kind: '邀请', title: '它走近了设备', meta: '14:32 · 客厅', body: '不是你先想起它，而是它先发出了一次邀请。' },
      { glyph: 'moment', kind: '片段', title: '今天它主动来过一次', meta: '6 秒', body: '关掉画面的那段时间，也有东西被留了下来。' },
      { glyph: 'rest', kind: '静默', title: '它在休息，未打扰', meta: '无提醒', body: '不打扰它的节奏，本身就是设计的一部分。' }
    ],
    stageTitle: '我们现在在哪',
    stageText: '只有研究、竞品分析和设计原则，没有可用的产品。下一步是访谈养宠人、做原型，观察人与宠物是否真的愿意使用。',

    subLabel: '08 / 参与进来',
    subTitle: '如果你也有这种牵挂，<br>我们想听听你的经历。',
    subText: '留下邮箱，只有出现实质进展时我们才会来信：研究发现、原型进展或体验招募。',
    emailLabel: '邮箱地址',
    emailPlaceholder: 'you@example.com',
    consent: '我同意接收本项目的进展及体验招募邮件。',
    consentNote: '邮箱仅用于本项目联系，不公开、不出售。订阅免费，不代表预订或购买。',
    privacyTitle: '邮箱会怎样被使用？',
    privacyText: '我们保存你的邮箱、订阅时间、所选语言和同意版本，用于项目进展与体验招募联系。目前不会自动发送邮件。',
    successLabel: '登记成功',
    successTitle: '谢谢，期待与你再见。',
    successLead: '邮箱',
    successAfter: '已保存。',
    successText: '有新的研究发现或原型进展时，我们会来信。',
    reset: '使用其他邮箱',
    faqTitle: '你可能也想知道',
    faqs: [
      { q: '和宠物摄像头有什么不同？', a: '摄像头主要帮你查看、说话和投喂。我们关注的是另外三件事：它能否主动发起连接，你不在线时如何回应，以及一次互动之后连接怎样继续。具体方式仍需要研究和原型验证。' },
      { q: '现在能买到或用上吗？', a: '不能。目前处于研究与概念探索阶段，还没有成品。如果开放原型体验，我们会通过订阅邮件告知。' },
      { q: '订阅以后会收到什么？', a: '只会在有实质进展时联系你：研究发现、原型进展或体验招募。订阅免费，不代表预订或购买，也不需要付费。' }
    ],
    footerNote: '宠物远程陪伴 · 早期研究项目',
    footerLang: 'English',
    copyright: '© 2026'
  },

  en: {
    lang: 'en',
    sourceNote: 'Sources: USDA FAS, Pet Food Market Update 2026; KPMG, 2025 China Pet Industry Market Report',
    title: 'Seeing them isn’t the same as being with them | Pet Companionship',
    desc: 'A camera lets you see your pet, but it can’t hold the companionship. An early-stage research project exploring connection that can start from either side. Follow our research, prototypes and testing.',
    ogLocale: 'en_US',
    ogLocaleAlt: 'zh_CN',
    skip: 'Skip to content',
    brandLine: 'Remote pet companionship',
    brandNote: 'Early-stage research',
    nav: 'Main navigation',
    navGap: 'The problem',
    navTurn: 'The opportunity',
    navUsers: 'Who it’s for',
    navCta: 'Get updates',
    langSwitch: '中文',
    langSwitchLabel: '阅读中文版',

    eyebrow: 'REMOTE PET COMPANIONSHIP · EARLY RESEARCH · 2026',
    h1: 'Seeing them<br>isn’t the same as <em>being with them</em>.',
    lede: 'A camera can tell you where your pet is and what they’re doing.<br>But what you actually want to know is whether your presence reached them.',
    stage: 'Research and concept stage · Nothing is available to buy',
    ctaPrimary: 'Get project updates',
    ctaQuiet: 'Start with the five moments',
    heroAlt: 'A cat leaning its face against its owner, a thin line between them',
    petAlt: 'A line drawing of a cat whose tail extends into a line reaching the owner, with pulses travelling both ways.',
    petCap: 'The tail is the connection we want to restore.',

    factsLabel: 'The size of this',
    facts: [
      { value: '312.6', unit: 'RMB bn', text: 'China’s urban dog and cat market in 2025, up 4.1% year over year' },
      { value: '1.26', unit: 'million', text: 'Urban dogs and cats in 2025; cats lead both population and growth' },
      { value: '00s', unit: 'fastest', text: 'People born in the 1990s remain the largest group; the post-2000 cohort grows fastest and expects more from digital products' }
    ],

    gapLabel: '01 / The problem we work on',
    gapTitle: 'Technology lets us see them.<br>It hasn’t solved companionship.',
    gapIntro: 'Five moments happen every day. The first four work. After the fifth, the connection stops.',
    steps: [
      { n: '01', t: 'You leave home', d: 'Work / business trip / travel' },
      { n: '02', t: 'Missing and worrying', d: '“What are they doing right now?”' },
      { n: '03', t: 'You open the camera', d: 'Actively looking for them' },
      { n: '04', t: 'One-way interaction', d: 'Watch / talk / feed' },
      { n: '05', t: 'Disconnected again', d: 'The device closes; the relationship pauses', isBreak: true }
    ],
    breakLabel: 'The break point',
    breakText: 'Every connection has to begin with you remembering them.<br>They have no way to reach you first.',
    awayCaption: 'You’re here. They’re there.',

    marketLabel: '02 / What exists today',
    marketTitle: 'See them, talk to them, feed them.<br>Then what?',
    marketIntro: 'We looked at five representative products, from $56 to $199. They do monitoring and play well, and then stop in the same place.',
    devicesAlt: 'Three product forms: fixed camera, mobile robot, smart toy',
    devicesCaption: 'Three forms: fixed camera · mobile robot · smart toy',
    hasTitle: 'What they already do',
    has: ['Show you what your pet is doing', 'Let them hear your voice', 'Feed or play with them remotely', 'Reassure you for a moment'],
    lacksTitle: 'What’s still missing',
    lacks: ['Interaction is almost always owner-initiated', 'Your pet can’t reach you first', 'Connection ends when the screen closes', 'Emotional support stays fragmented'],
    productsHead: ['Product', 'Form & price', 'Main gap'],
    products: [
      { name: 'Furbo 360°', form: 'Fixed camera · $119', gap: 'Fixed location; smart alerts need a subscription' },
      { name: 'Petcube Bites 2', form: 'Fixed camera · $169', gap: 'No pan or tilt; history and alerts need a subscription' },
      { name: 'Enabot ROLA PetPal', form: 'Mobile robot · from $199', gap: 'Size and noise; limited sense of touch' },
      { name: 'PETKIT YumShare', form: 'Feeder + camera · $119.99', gap: 'Mostly solves feeding, not company' },
      { name: 'Cheerble Wickedbone Air', form: 'Smart toy · $56.09', gap: 'No monitoring and no two-way emotional response' }
    ],
    productsNote: 'Monitoring products reduce uncertainty, but pets only interact while an owner is online. Robot toys increase engagement, yet monitoring, touch and a lasting relationship stay separate.',

    usersLabel: '03 / Who we design for',
    usersTitle: 'Not every pet owner.',
    usersIntro: 'But those who are deeply bonded with their pet and are often unable to be in the same space.',
    users: [
      { t: 'Urban working owners', d: 'Away from home for long hours' },
      { t: 'Frequent business or short-trip travellers', d: 'Regular separation' },
      { t: 'People living alone with a strong bond', d: 'Their pet is an important source of company' }
    ],
    usersTrait: 'What they share: their pet is no longer just a pet — it is family. Yet everyday life means they can’t always share the same space.',

    turnLabel: '04 / The opportunity',
    turnTitle: 'From remote monitoring<br>to remote companionship.',
    currentTitle: 'Today',
    currentSub: 'Remote Monitoring',
    currentChain: ['Owner', 'Camera', 'Pet'],
    currentCap: 'The owner starts the connection, and the owner ends it.',
    currentPoints: [
      { t: 'See what the pet is doing', d: 'The screen shows where they are, not how they feel' },
      { t: 'Owner talks to the pet', d: 'You call out; whether they respond depends on the moment' },
      { t: 'Owner feeds or plays remotely', d: 'You start it, and you decide when it ends' },
      { t: 'Interaction ends and disconnects', d: 'The screen closes and the connection stops there' }
    ],
    nextTitle: 'The opportunity',
    nextSub: 'Remote Companionship',
    nextChain: ['Owner', 'Device and AI', 'Pet'],
    nextCap: 'Connection can start from either side.',
    nextPoints: [
      { t: 'Let them reach out too', d: 'A way in that starts from the pet’s own natural behaviour' },
      { t: 'Make missing them tangible', d: 'Turn “I miss them” into a real interaction' },
      { t: 'No need to stay online', d: 'Meaningful response without watching a screen' },
      { t: 'From moments to a relationship', d: 'Companionship that doesn’t end when the screen closes' }
    ],

    principlesLabel: '06 / Design principles',
    hmwLabel: 'The question we’re answering',
    hmw: 'When an owner can’t be with their pet,<br>how can the emotional connection between them<br>still happen naturally?',
    principles: [
      { t: 'Informed', e: '明察', d: 'Know they’re okay, simply and reassuringly' },
      { t: 'Connected', e: '相连', d: 'Feel a meaningful two-way bond, even apart' },
      { t: 'Respectful', e: '尊重', d: 'Follow their nature; don’t disturb their rest' },
      { t: 'Supportive', e: '支持', d: 'Fit into your life without adding weight' }
    ],

    directionsLabel: '07 / What we’re testing',
    directionsTitle: 'Four things we’re exploring.',
    directions: [
      { n: '01', t: 'They can start it too', d: 'A way in that the pet can trigger through natural behaviour' },
      { n: '02', t: 'A light two-way response', d: 'No constant screen time, no frequent interruption for them' },
      { n: '03', t: 'Keep the shared everyday', d: 'Not only live video, but moments you can come back to' },
      { n: '04', t: 'A relationship that lasts', d: 'From a single interaction toward ongoing connection' }
    ],
    netLabel: 'Direction of connection',
    netNow: 'Today · one way',
    netNext: 'The opportunity · two way',
    netAlt: 'Diagram: today the connection is initiated one way by the owner; the opportunity is a two-way connection between owner and pet, held by the device and AI.',
    conceptLabel: '05 / Concept sketches',
    conceptTitle: 'If they could reach you first,<br>what would that moment look like?',
    conceptNote: 'These are interaction concept sketches, to show direction. They are not a working product and not a real interface.',
    conceptTag: 'CONCEPT',
    concepts: [
      { glyph: 'signal', kind: 'INVITATION', title: 'They walked up to the device', meta: '14:32 · living room', body: 'Not you remembering them first — them sending an invitation.' },
      { glyph: 'moment', kind: 'MOMENT', title: 'They reached out once today', meta: '6s clip', body: 'Something was kept from the hours the screen was closed.' },
      { glyph: 'rest', kind: 'QUIET', title: 'They are resting, undisturbed', meta: 'no alert', body: 'Not interrupting their rhythm is part of the design.' }
    ],
    stageTitle: 'Where we are',
    stageText: 'Research, competitor analysis and design principles — no product yet. Next: interview owners, build prototypes, and observe whether people and pets actually choose to use them.',

    subLabel: '08 / Take part',
    subTitle: 'If this feels familiar,<br>we’d like to hear what it’s like for you.',
    subText: 'Leave your email. We only write when there is something real: findings, prototype progress, or a testing invitation.',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    consent: 'I agree to receive project updates and testing invitations.',
    consentNote: 'Your email is used for this project only. Never published or sold. Subscribing is free and is not a purchase or a reservation.',
    privacyTitle: 'How will my email be used?',
    privacyText: 'We store your email, signup time, language and consent version to contact you about project progress and testing. No automated emails are sent at this stage.',
    successLabel: 'You’re on the list',
    successTitle: 'Thank you. We’ll be in touch.',
    successLead: 'Your email',
    successAfter: 'has been saved.',
    successText: 'We’ll write when there are new findings or prototype updates.',
    reset: 'Use a different email',
    faqTitle: 'A few things you might wonder',
    faqs: [
      { q: 'How is this different from a pet camera?', a: 'Cameras mainly help you check in, talk and offer treats. We’re looking at three other things: whether a pet can initiate a connection, how you could respond when you’re offline, and how connection continues after a single interaction. All of it still needs research and prototype testing.' },
      { q: 'Can I buy or use something yet?', a: 'No. We’re at the research and concept stage, and there is no finished product. If prototype testing opens up, we’ll let subscribers know by email.' },
      { q: 'What will I receive if I subscribe?', a: 'Only meaningful progress: findings, prototype updates or testing invitations. Subscribing is free and does not commit you to a purchase or a reservation.' }
    ],
    footerNote: 'Remote pet companionship · Early-stage research project',
    footerLang: '中文',
    copyright: '© 2026'
  }
};
