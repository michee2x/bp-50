export interface ChallengeTaskSeed {
  day_number: number;
  title: string;
  focus: string;
  why_it_matters: string;
  task_description: string;
  personal_brand_variant: string;
  business_brand_variant: string;
  completion_type: string;
  optional: boolean;
}

export function buildVisibilityTasks(days: number): ChallengeTaskSeed[] {
  const tasks: ChallengeTaskSeed[] = [
    {
      day_number: 1,
      title: 'Visibility Reset',
      focus: 'Awareness',
      why_it_matters: 'Clear intention drives consistent action',
      task_description: 'Write a one-paragraph answer to what you want to be known for and update your bio or headline.',
      personal_brand_variant: 'Write what you want to be known for as a personal brand and update your bio or headline to reflect it.',
      business_brand_variant: 'Write what you want your business to be known for and update your company bio or headline to reflect it.',
      completion_type: 'text_input',
      optional: false,
    },
    {
      day_number: 2,
      title: 'Clarity Before Noise',
      focus: 'Message clarity',
      why_it_matters: 'Clear messages get remembered',
      task_description: 'Write 3 content ideas around what you know, what people ask, and what problem you solve.',
      personal_brand_variant: 'Write 3 content ideas around your expertise, common questions people ask you, and the problem you solve.',
      business_brand_variant: 'Write 3 content ideas around your company expertise, customer FAQs, and the client problem you solve.',
      completion_type: 'text_input',
      optional: false,
    },
    {
      day_number: 3,
      title: 'First Signal',
      focus: 'Showing up',
      why_it_matters: 'Action beats perfection every time',
      task_description: 'Publish one post today without overthinking it.',
      personal_brand_variant: 'Publish one personal post that shares your expertise, insight, or story.',
      business_brand_variant: 'Publish one business post that shares value, proof, or perspective.',
      completion_type: 'text_input',
      optional: false,
    },
  ];

  if (days >= 7) {
    tasks.push(
      {
        day_number: 4,
        title: 'Consistency Test',
        focus: 'Repetition',
        why_it_matters: 'Consistency builds recognition',
        task_description: 'Publish again and engage with relevant accounts in your niche.',
        personal_brand_variant: 'Publish a second post and engage with 5 creators or peers in your niche.',
        business_brand_variant: 'Publish a second post and engage with 5 prospects, partners, or relevant brands.',
        completion_type: 'text_input',
        optional: false,
      },
      {
        day_number: 5,
        title: 'Human Presence',
        focus: 'Connection',
        why_it_matters: 'People connect with people, not faceless noise',
        task_description: 'Share something more human today: a story, lesson, or behind-the-scenes moment.',
        personal_brand_variant: 'Share a personal story, lesson learned, or behind-the-scenes moment.',
        business_brand_variant: 'Share a brand story, customer lesson, or behind-the-scenes company moment.',
        completion_type: 'text_input',
        optional: false,
      },
      {
        day_number: 6,
        title: 'Signal Strength',
        focus: 'Positioning',
        why_it_matters: 'Strong positioning attracts the right audience',
        task_description: 'Share a firm opinion or insight instead of generic motivation.',
        personal_brand_variant: 'Share a strong opinion or differentiated insight from your personal experience.',
        business_brand_variant: 'Share a strong market or customer insight from the business point of view.',
        completion_type: 'text_input',
        optional: false,
      },
      {
        day_number: 7,
        title: 'Reflection and Lock-In',
        focus: 'Awareness',
        why_it_matters: 'Reflection turns action into learning',
        task_description: 'Reflect on what felt hard, what worked, and what surprised you this week.',
        personal_brand_variant: 'Reflect on what felt hard about showing up, what worked, and what surprised you.',
        business_brand_variant: 'Reflect on what was challenging for the business, what worked, and what surprised you.',
        completion_type: 'text_input',
        optional: false,
      }
    );
  }

  if (days >= 14) {
    for (let day = 8; day <= 14; day += 1) {
      tasks.push({
        day_number: day,
        title: `Visibility Day ${day}`,
        focus: day <= 10 ? 'Consistency' : 'Reinforcement',
        why_it_matters: 'Daily practice builds lasting habits',
        task_description: 'Create one useful visibility action and engage with your audience.',
        personal_brand_variant: 'Create one piece of content or visibility action and engage with 3 to 5 people in your niche.',
        business_brand_variant: 'Create one value-driven brand action and engage with potential clients, customers, or partners.',
        completion_type: 'text_input',
        optional: day > 10,
      });
    }
  }

  if (days === 30) {
    const weeklyThemes = [
      { week: 2, theme: 'Consistency', startDay: 15, endDay: 21 },
      { week: 3, theme: 'Confidence', startDay: 22, endDay: 28 },
      { week: 4, theme: 'Presence', startDay: 29, endDay: 30 },
    ];

    for (const week of weeklyThemes) {
      for (let day = week.startDay; day <= week.endDay; day += 1) {
        tasks.push({
          day_number: day,
          title: `Week ${week.week}: ${week.theme} - Day ${day}`,
          focus: week.theme,
          why_it_matters: `${week.theme} grows your visibility into a real system`,
          task_description: `Take one deliberate visibility action today that builds ${week.theme.toLowerCase()}.`,
          personal_brand_variant: `Take one personal brand action today that builds ${week.theme.toLowerCase()} and public consistency.`,
          business_brand_variant: `Take one business brand action today that builds ${week.theme.toLowerCase()} and public consistency.`,
          completion_type: 'text_input',
          optional: false,
        });
      }
    }
  }

  return tasks
    .sort((a, b) => a.day_number - b.day_number)
    .filter((task, index, list) => list.findIndex((candidate) => candidate.day_number === task.day_number) === index);
}

export function buildAuthorityTasks(days: number): ChallengeTaskSeed[] {
  const baseTasks: ChallengeTaskSeed[] = [
    {
      day_number: 1,
      title: 'Authority Identity',
      focus: 'Clarity',
      why_it_matters: 'Authority starts with being specific about what people should trust you for.',
      task_description: 'Answer: People should trust me for ______ because ______.',
      personal_brand_variant: 'Answer: People should trust me for ______ because ______ using your personal expertise.',
      business_brand_variant: 'Answer: People should trust our brand for ______ because ______ using your business value.',
      completion_type: 'text_input',
      optional: false,
    },
    {
      day_number: 2,
      title: 'Niche Compression',
      focus: 'Clarity',
      why_it_matters: 'Generic authority does not stick in the market.',
      task_description: 'Narrow your expertise to one primary problem, one audience, and one clear angle.',
      personal_brand_variant: 'Define one audience, one problem, and one authority lane you want to own personally.',
      business_brand_variant: 'Define one audience, one problem, and one category your business should own.',
      completion_type: 'text_input',
      optional: false,
    },
    {
      day_number: 3,
      title: 'Authority Statement',
      focus: 'Positioning',
      why_it_matters: 'You need language the market can repeat back clearly.',
      task_description: 'Write a one to two sentence authority positioning statement.',
      personal_brand_variant: 'Write a one to two sentence authority statement for your personal brand bio.',
      business_brand_variant: 'Write a one to two sentence authority statement for your business brand.',
      completion_type: 'text_input',
      optional: false,
    },
    {
      day_number: 4,
      title: 'Category Mapping',
      focus: 'Positioning',
      why_it_matters: 'Authority grows faster when people know what box you belong in or why you created a new one.',
      task_description: 'List who you are not competing with and what makes you different.',
      personal_brand_variant: 'List who you are not competing with and how your perspective differs.',
      business_brand_variant: 'List what your business should never be confused with and what makes it distinct.',
      completion_type: 'text_input',
      optional: false,
    },
    {
      day_number: 5,
      title: 'Audience Trust Lens',
      focus: 'Trust',
      why_it_matters: 'Authority answers fears before buyers say them out loud.',
      task_description: 'Write the fears, doubts, and desires your audience carries into the buying decision.',
      personal_brand_variant: 'Write what your audience fears, doubts, and wants from a trusted expert like you.',
      business_brand_variant: 'Write what your ideal customers fear, doubt, and hope your business will solve.',
      completion_type: 'text_input',
      optional: false,
    },
    {
      day_number: 6,
      title: 'Authority Content Pillars',
      focus: 'Consistency',
      why_it_matters: 'Authority compounds when your message repeats with structure.',
      task_description: 'Define three repeatable authority content themes.',
      personal_brand_variant: 'Define three repeatable authority themes you can teach from consistently.',
      business_brand_variant: 'Define three repeatable authority themes your brand should publish around.',
      completion_type: 'text_input',
      optional: false,
    },
    {
      day_number: 7,
      title: 'Weekly Lock-In',
      focus: 'Signal',
      why_it_matters: 'Authority is confirmed publicly, not privately.',
      task_description: 'Publish one authority-driven post with a clear opinion or teaching point.',
      personal_brand_variant: 'Publish one authority-driven post that teaches or stakes a clear perspective.',
      business_brand_variant: 'Publish one authority-driven post that teaches or positions your business clearly.',
      completion_type: 'text_input',
      optional: false,
    },
  ];

  if (days >= 14) {
    for (let day = 8; day <= 14; day += 1) {
      baseTasks.push({
        day_number: day,
        title: `Authority Proof Day ${day}`,
        focus: day <= 10 ? 'Proof' : 'Credibility',
        why_it_matters: 'Trust grows when proof becomes visible.',
        task_description: 'Create or publish one authority signal such as a proof asset, case example, framework, or testimonial.',
        personal_brand_variant: 'Create one authority signal like a case breakdown, framework, lesson, or testimonial.',
        business_brand_variant: 'Create one authority signal like a case study, process breakdown, proof post, or testimonial.',
        completion_type: 'text_input',
        optional: false,
      });
    }
  }

  if (days >= 30) {
    const titles: Record<number, string> = {
      15: 'Opinion Development',
      16: 'Framework Thinking',
      17: 'Thought Leadership Post',
      18: 'Signal Repetition',
      19: 'Market Education',
      20: 'Anti-Positioning',
      21: 'Weekly Reflection',
      22: 'Offer Alignment',
      23: 'Pricing Confidence',
      24: 'Conversion Trust Asset',
      25: 'Call-to-Action Clarity',
      26: 'Authority Content with CTA',
      27: 'Objection Handling',
      28: 'Market Presence Check',
      29: 'Authority Consolidation',
      30: 'Authority Certification',
    };

    for (let day = 15; day <= 30; day += 1) {
      baseTasks.push({
        day_number: day,
        title: titles[day],
        focus: day <= 21 ? 'Perspective' : 'Trust & Monetization',
        why_it_matters: day <= 21
          ? 'Thought leadership is built through repeated perspective.'
          : 'Authority should eventually support stronger trust and commercial leverage.',
        task_description: 'Complete the authority action for today and capture the output you created.',
        personal_brand_variant: 'Complete today’s authority action and save the output created for your personal brand.',
        business_brand_variant: 'Complete today’s authority action and save the output created for your business brand.',
        completion_type: 'text_input',
        optional: false,
      });
    }
  }

  if (days > 30) {
    for (let day = 31; day <= days; day += 1) {
      baseTasks.push({
        day_number: day,
        title: `Authority Extension Day ${day}`,
        focus: 'Authority Expansion',
        why_it_matters: 'Authority grows when the market sees repeated trust signals over time.',
        task_description: 'Create one more authority signal today and save the output.',
        personal_brand_variant: 'Create one more authority signal for your personal brand today and save the output.',
        business_brand_variant: 'Create one more authority signal for your business brand today and save the output.',
        completion_type: 'text_input',
        optional: false,
      });
    }
  }

  return baseTasks
    .sort((a, b) => a.day_number - b.day_number)
    .filter((task, index, list) => list.findIndex((candidate) => candidate.day_number === task.day_number) === index);
}
