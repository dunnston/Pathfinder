/**
 * Value Cards for Values Discovery Module
 * 72+ cards across 9 categories (8+ per category)
 * Categories are internal only - not shown to users
 */

import type { ValueCard, ValueCategory } from '../types/valuesDiscovery';

/** Helper to create a value card with consistent structure */
function createCard(
  id: string,
  title: string,
  description: string,
  category: ValueCategory,
  scenarioPrompt: string,
  tradeoffTag?: string[]
): ValueCard {
  return {
    id,
    title,
    description,
    category,
    scenarioPrompt,
    tradeoffTag,
    isCustom: false,
  };
}

/** Security category cards */
const SECURITY_CARDS: ValueCard[] = [
  createCard(
    'security_financial_security',
    'Financial security',
    'Having enough resources to handle life without financial stress.',
    'SECURITY',
    'Would you choose a lower-return investment if it meant more predictable income?'
  ),
  createCard(
    'security_emergency_preparedness',
    'Emergency preparedness',
    'Having reserves and plans to handle unexpected expenses without panic.',
    'SECURITY',
    'If an unexpected $10,000 expense happened tomorrow, would being prepared matter more to you than maximizing long-term growth?'
  ),
  createCard(
    'security_stable_income',
    'Stable income',
    'Having predictable, reliable income you can count on.',
    'SECURITY',
    'Would you prefer guaranteed income over potentially higher but variable returns?'
  ),
  createCard(
    'security_predictable_expenses',
    'Predictable expenses',
    'Knowing what your costs will be month to month.',
    'SECURITY',
    'Would you pay more for a fixed-rate option to avoid surprises in your budget?'
  ),
  createCard(
    'security_insurance_protection',
    'Insurance protection',
    'Having proper coverage to protect against major financial setbacks.',
    'SECURITY',
    'Would you prioritize comprehensive insurance even if it reduces discretionary spending?'
  ),
  createCard(
    'security_risk_management',
    'Risk management',
    'Having strategies to minimize financial risks and protect what you have.',
    'SECURITY',
    'Would you accept lower potential gains to reduce your exposure to loss?'
  ),
  createCard(
    'security_debt_reduction',
    'Debt reduction',
    'Eliminating debts to reduce financial obligations and stress.',
    'SECURITY',
    'Would you prioritize paying off debt over building investments?'
  ),
  createCard(
    'security_guaranteed_retirement_income',
    'Guaranteed income in retirement',
    'Having income you cannot outlive, no matter how long you live.',
    'SECURITY',
    'Would you trade some upside potential for guaranteed lifetime income?'
  ),
  createCard(
    'security_safe_investments',
    'Safe investments',
    'Keeping money in lower-risk options that protect principal.',
    'SECURITY',
    'Would you prefer investments that preserve capital over those with higher growth potential?'
  ),
  createCard(
    'security_protection_for_dependents',
    'Protection for dependents',
    'Ensuring those who depend on you are financially protected.',
    'SECURITY',
    'Would you allocate resources to protect dependents even if it limits your own options?'
  ),
  createCard(
    'security_housing_stability',
    'Housing stability',
    'Having a secure, stable place to live without financial strain.',
    'SECURITY',
    'Would you prioritize paying off your home over other financial goals?'
  ),
  createCard(
    'security_long_term_care_readiness',
    'Long-term care readiness',
    'Being prepared for potential long-term care needs later in life.',
    'SECURITY',
    'Would you set aside resources for potential care needs even if you may never use them?'
  ),
];

/** Freedom category cards */
const FREEDOM_CARDS: ValueCard[] = [
  createCard(
    'freedom_financial_independence',
    'Financial independence',
    'Having enough resources that work is optional, not required.',
    'FREEDOM',
    'Would you accept a simpler lifestyle to achieve financial independence sooner?'
  ),
  createCard(
    'freedom_work_optional',
    'Work-optional lifestyle',
    'Having the choice to work because you want to, not because you have to.',
    'FREEDOM',
    'Would you prioritize saving aggressively to make work optional earlier?'
  ),
  createCard(
    'freedom_flexible_schedule',
    'Flexible schedule',
    'Having control over when and how you spend your time.',
    'FREEDOM',
    'Would you trade higher income for more control over your schedule?'
  ),
  createCard(
    'freedom_ability_to_travel',
    'Ability to travel',
    'Having the resources and flexibility to travel when you want.',
    'FREEDOM',
    'Would you prioritize travel experiences over building a larger financial cushion?'
  ),
  createCard(
    'freedom_location_independence',
    'Location independence',
    'Having the freedom to live or work from anywhere.',
    'FREEDOM',
    'Would you accept trade-offs in income or career to live where you want?'
  ),
  createCard(
    'freedom_early_retirement_option',
    'Early retirement option',
    'Having the ability to retire before traditional retirement age.',
    'FREEDOM',
    'Would you make lifestyle sacrifices now to have the option to retire early?'
  ),
  createCard(
    'freedom_career_change_choice',
    'Choice in career changes',
    'Having the financial flexibility to change careers or pursue new paths.',
    'FREEDOM',
    'Would you maintain financial reserves specifically to enable career flexibility?'
  ),
  createCard(
    'freedom_saying_no',
    'Saying no to unwanted work',
    'Having the ability to decline work that does not align with your values.',
    'FREEDOM',
    'Would you prioritize financial independence to have the power to say no?'
  ),
  createCard(
    'freedom_time_autonomy',
    'Time autonomy',
    'Having complete control over how you allocate your time.',
    'FREEDOM',
    'Would you trade income growth for more control over your daily time?'
  ),
  createCard(
    'freedom_lifestyle_flexibility',
    'Lifestyle flexibility',
    'Having options to adjust your lifestyle based on changing preferences.',
    'FREEDOM',
    'Would you keep resources liquid to maintain lifestyle flexibility?'
  ),
];

/** Family category cards */
const FAMILY_CARDS: ValueCard[] = [
  createCard(
    'family_providing_for_children',
    'Providing for children',
    'Ensuring your children have what they need to thrive.',
    'FAMILY',
    'Would you adjust your own retirement plans to better provide for your children?'
  ),
  createCard(
    'family_supporting_spouse',
    'Supporting spouse or partner',
    'Ensuring your spouse or partner is financially secure.',
    'FAMILY',
    'Would you prioritize survivor benefits over maximizing your own retirement income?'
  ),
  createCard(
    'family_college_funding',
    'College funding',
    'Helping children or grandchildren with education costs.',
    'FAMILY',
    'Would you reduce your retirement savings to fund education for family members?'
  ),
  createCard(
    'family_caring_for_parents',
    'Caring for aging parents',
    'Being able to support aging parents financially or with time.',
    'FAMILY',
    'Would you set aside resources for potential parent care needs?'
  ),
  createCard(
    'family_traditions_experiences',
    'Family traditions and experiences',
    'Creating and maintaining meaningful family experiences together.',
    'FAMILY',
    'Would you prioritize family experiences over building a larger financial reserve?'
  ),
  createCard(
    'family_inheritance_planning',
    'Inheritance planning',
    'Leaving assets or wealth to the next generation.',
    'FAMILY',
    'Would you reduce your own spending to leave more for your heirs?'
  ),
  createCard(
    'family_generational_stability',
    'Generational stability',
    'Breaking cycles and building lasting family financial health.',
    'FAMILY',
    'Would you invest in financial education for family members even at some cost?'
  ),
  createCard(
    'family_vacations',
    'Family vacations',
    'Having resources for meaningful family travel and time together.',
    'FAMILY',
    'Would you budget specifically for family vacation experiences?'
  ),
  createCard(
    'family_keeping_home',
    'Keeping the family home',
    'Maintaining a family residence that holds meaning and memories.',
    'FAMILY',
    'Would you make financial trade-offs to keep a family home?'
  ),
  createCard(
    'family_present_for_milestones',
    'Being present for milestones',
    'Having time and resources to be there for important family moments.',
    'FAMILY',
    'Would you prioritize flexibility over income to be present for family events?'
  ),
];

/** Growth category cards */
const GROWTH_CARDS: ValueCard[] = [
  createCard(
    'growth_career_advancement',
    'Career advancement',
    'Continuing to grow and progress in your professional life.',
    'GROWTH',
    'Would you invest in career development even if retirement is approaching?'
  ),
  createCard(
    'growth_business_ownership',
    'Business ownership',
    'Owning or building a business of your own.',
    'GROWTH',
    'Would you take on more risk to pursue business ownership?'
  ),
  createCard(
    'growth_skill_development',
    'Skill development',
    'Continuously learning new skills and capabilities.',
    'GROWTH',
    'Would you allocate resources to skill development throughout life?'
  ),
  createCard(
    'growth_education_training',
    'Education and training',
    'Pursuing formal education or professional development.',
    'GROWTH',
    'Would you invest in education even later in life?'
  ),
  createCard(
    'growth_personal_development',
    'Personal development',
    'Investing in becoming a better version of yourself.',
    'GROWTH',
    'Would you prioritize personal growth experiences over financial growth?'
  ),
  createCard(
    'growth_new_ventures',
    'Trying new ventures',
    'Having resources to pursue new opportunities and ideas.',
    'GROWTH',
    'Would you keep resources available for future opportunities?'
  ),
  createCard(
    'growth_building_wealth',
    'Building wealth',
    'Growing your net worth and financial resources over time.',
    'GROWTH',
    'Would you accept more volatility to maximize wealth building?'
  ),
  createCard(
    'growth_expanding_opportunities',
    'Expanding opportunities',
    'Creating more options and possibilities for yourself.',
    'GROWTH',
    'Would you invest in expanding your opportunities even without immediate returns?'
  ),
  createCard(
    'growth_reinvention',
    'Reinvention later in life',
    'Having the ability to reinvent yourself in later years.',
    'GROWTH',
    'Would you keep options open for major life changes in the future?'
  ),
  createCard(
    'growth_lifelong_learning',
    'Lifelong learning',
    'Continuing to learn and grow throughout your entire life.',
    'GROWTH',
    'Would you budget for learning and development indefinitely?'
  ),
];

/** Contribution category cards */
const CONTRIBUTION_CARDS: ValueCard[] = [
  createCard(
    'contribution_charitable_giving',
    'Charitable giving',
    'Supporting causes and organizations you care about.',
    'CONTRIBUTION',
    'Would you reduce personal spending to increase charitable giving?'
  ),
  createCard(
    'contribution_local_community',
    'Supporting local community',
    'Investing time or resources in your local community.',
    'CONTRIBUTION',
    'Would you prioritize community involvement over personal goals?'
  ),
  createCard(
    'contribution_faith_based_giving',
    'Faith-based giving',
    'Supporting your faith community through financial contributions.',
    'CONTRIBUTION',
    'Would you maintain tithing or faith-based giving even during tight finances?'
  ),
  createCard(
    'contribution_volunteering',
    'Volunteering',
    'Having time and resources to volunteer for causes you believe in.',
    'CONTRIBUTION',
    'Would you structure your finances to enable more volunteer time?'
  ),
  createCard(
    'contribution_funding_causes',
    'Funding causes they care about',
    'Financially supporting causes and movements that matter to you.',
    'CONTRIBUTION',
    'Would you allocate a specific portion of resources to causes you believe in?'
  ),
  createCard(
    'contribution_helping_family',
    'Helping family financially',
    'Being able to help extended family members when needed.',
    'CONTRIBUTION',
    'Would you maintain reserves specifically to help family members?'
  ),
  createCard(
    'contribution_mentoring',
    'Mentoring others',
    'Investing time in helping others grow and develop.',
    'CONTRIBUTION',
    'Would you prioritize time for mentoring over income-generating activities?'
  ),
  createCard(
    'contribution_disaster_support',
    'Disaster or crisis support',
    'Being able to help during emergencies and crises.',
    'CONTRIBUTION',
    'Would you keep resources available for unexpected giving opportunities?'
  ),
  createCard(
    'contribution_community_leadership',
    'Community leadership',
    'Taking leadership roles in community organizations.',
    'CONTRIBUTION',
    'Would you invest time in community leadership even at personal cost?'
  ),
];

/** Purpose category cards */
const PURPOSE_CARDS: ValueCard[] = [
  createCard(
    'purpose_meaningful_work',
    'Meaningful work',
    'Having work that provides purpose and fulfillment.',
    'PURPOSE',
    'Would you accept lower income for more meaningful work?'
  ),
  createCard(
    'purpose_legacy_building',
    'Legacy building',
    'Creating something that outlasts you and impacts others.',
    'PURPOSE',
    'Would you invest resources in building a lasting legacy?'
  ),
  createCard(
    'purpose_positive_impact',
    'Leaving a positive impact',
    'Making the world better through your actions and resources.',
    'PURPOSE',
    'Would you prioritize impact over personal accumulation?'
  ),
  createCard(
    'purpose_teaching_values',
    'Teaching values to children',
    'Passing on important values and lessons to the next generation.',
    'PURPOSE',
    'Would you invest time in teaching values even if it limits other activities?'
  ),
  createCard(
    'purpose_living_beliefs',
    'Living according to beliefs',
    'Aligning your financial life with your core beliefs and values.',
    'PURPOSE',
    'Would you accept financial trade-offs to live in alignment with your beliefs?'
  ),
  createCard(
    'purpose_stewardship',
    'Stewardship of resources',
    'Managing resources responsibly as a caretaker, not just an owner.',
    'PURPOSE',
    'Would you view your wealth as something to steward rather than simply own?'
  ),
  createCard(
    'purpose_faith_driven',
    'Faith-driven decisions',
    'Making financial decisions guided by faith and spiritual principles.',
    'PURPOSE',
    'Would you let faith guide financial decisions even when it seems counterintuitive?'
  ),
  createCard(
    'purpose_role_model',
    'Being a good role model',
    'Setting an example for others through your actions and choices.',
    'PURPOSE',
    'Would you make financial choices specifically to model good behavior?'
  ),
  createCard(
    'purpose_mission_vision',
    'Long-term mission or vision',
    'Working toward a larger purpose or life mission.',
    'PURPOSE',
    'Would you align financial decisions with a long-term life mission?'
  ),
];

/** Control category cards */
const CONTROL_CARDS: ValueCard[] = [
  createCard(
    'control_budgeting_confidence',
    'Budgeting confidence',
    'Feeling confident in your ability to manage a budget.',
    'CONTROL',
    'Would you invest time in developing strong budgeting skills?'
  ),
  createCard(
    'control_clear_plan',
    'Clear financial plan',
    'Having a documented, clear plan for your financial future.',
    'CONTROL',
    'Would you prioritize having a written plan over ad-hoc decision making?'
  ),
  createCard(
    'control_understanding_investments',
    'Understanding investments',
    'Knowing and understanding where your money is invested.',
    'CONTROL',
    'Would you choose simpler investments you understand over complex ones with potentially higher returns?'
  ),
  createCard(
    'control_knowing_money_goes',
    'Knowing where money goes',
    'Having visibility into your spending and cash flow.',
    'CONTROL',
    'Would you invest time in tracking spending to maintain awareness?'
  ),
  createCard(
    'control_tax_management',
    'Managing tax exposure',
    'Being proactive about tax planning and optimization.',
    'CONTROL',
    'Would you prioritize tax-efficient strategies even if more complex?'
  ),
  createCard(
    'control_avoiding_surprises',
    'Avoiding surprises',
    'Minimizing unexpected financial events and outcomes.',
    'CONTROL',
    'Would you accept lower returns for more predictability?'
  ),
  createCard(
    'control_organized_finances',
    'Organized finances',
    'Having all financial accounts and documents well-organized.',
    'CONTROL',
    'Would you invest time in organizing and documenting your finances?'
  ),
  createCard(
    'control_decision_confidence',
    'Decision-making confidence',
    'Feeling confident when making financial decisions.',
    'CONTROL',
    'Would you invest in financial education to increase confidence?'
  ),
  createCard(
    'control_adapting_plans',
    'Ability to adapt plans',
    'Having plans that can flex when circumstances change.',
    'CONTROL',
    'Would you build flexibility into your plans even if it reduces optimization?'
  ),
  createCard(
    'control_contingency_planning',
    'Planning for contingencies',
    'Having backup plans for various scenarios.',
    'CONTROL',
    'Would you invest resources in contingency planning?'
  ),
];

/** Health category cards */
const HEALTH_CARDS: ValueCard[] = [
  createCard(
    'health_access_healthcare',
    'Access to healthcare',
    'Having reliable access to quality medical care.',
    'HEALTH',
    'Would you prioritize healthcare access over other financial goals?'
  ),
  createCard(
    'health_expense_protection',
    'Medical expense protection',
    'Being protected against major medical costs.',
    'HEALTH',
    'Would you pay more for comprehensive health coverage?'
  ),
  createCard(
    'health_preventive_care',
    'Preventive care',
    'Having resources for wellness and prevention, not just treatment.',
    'HEALTH',
    'Would you invest in preventive health even if not required?'
  ),
  createCard(
    'health_mental_wellbeing',
    'Mental well-being',
    'Supporting mental health and emotional wellness.',
    'HEALTH',
    'Would you allocate resources specifically for mental health support?'
  ),
  createCard(
    'health_stress_reduction',
    'Stress reduction',
    'Structuring finances to reduce stress and anxiety.',
    'HEALTH',
    'Would you accept lower returns for a less stressful financial approach?'
  ),
  createCard(
    'health_lifestyle_support',
    'Healthy lifestyle support',
    'Having resources to support a healthy lifestyle (gym, nutrition, etc.).',
    'HEALTH',
    'Would you budget specifically for healthy lifestyle expenses?'
  ),
  createCard(
    'health_rest_recovery',
    'Ability to rest and recover',
    'Having time and resources to rest when needed.',
    'HEALTH',
    'Would you prioritize rest and recovery over maximizing productivity?'
  ),
  createCard(
    'health_major_illness_coverage',
    'Coverage for major illness',
    'Being financially protected if a serious illness occurs.',
    'HEALTH',
    'Would you maintain robust insurance even at higher cost?'
  ),
  createCard(
    'health_long_term_wellness',
    'Long-term wellness planning',
    'Planning for health and wellness throughout life.',
    'HEALTH',
    'Would you include health costs as a core part of retirement planning?'
  ),
];

/** Quality of Life category cards */
const QUALITY_OF_LIFE_CARDS: ValueCard[] = [
  createCard(
    'qol_comfortable_lifestyle',
    'Comfortable lifestyle',
    'Living comfortably without constant financial worry.',
    'QUALITY_OF_LIFE',
    'Would you prioritize comfort over maximizing wealth?'
  ),
  createCard(
    'qol_hobbies',
    'Enjoyment of hobbies',
    'Having resources for hobbies and personal interests.',
    'QUALITY_OF_LIFE',
    'Would you budget specifically for hobby expenses?'
  ),
  createCard(
    'qol_travel_experiences',
    'Travel experiences',
    'Having meaningful travel experiences throughout life.',
    'QUALITY_OF_LIFE',
    'Would you prioritize travel spending over savings?'
  ),
  createCard(
    'qol_time_with_loved_ones',
    'Time with loved ones',
    'Having time to spend with people who matter most.',
    'QUALITY_OF_LIFE',
    'Would you trade income for more time with loved ones?'
  ),
  createCard(
    'qol_work_life_balance',
    'Work-life balance',
    'Maintaining balance between work and personal life.',
    'QUALITY_OF_LIFE',
    'Would you accept lower income for better work-life balance?'
  ),
  createCard(
    'qol_comfortable_housing',
    'Comfortable housing',
    'Living in a comfortable, pleasant home environment.',
    'QUALITY_OF_LIFE',
    'Would you spend more on housing for comfort and enjoyment?'
  ),
  createCard(
    'qol_dining_entertainment',
    'Dining and entertainment',
    'Enjoying restaurants, shows, and entertainment experiences.',
    'QUALITY_OF_LIFE',
    'Would you maintain dining and entertainment budget even during saving phases?'
  ),
  createCard(
    'qol_leisure_activities',
    'Leisure activities',
    'Having time and resources for relaxation and leisure.',
    'QUALITY_OF_LIFE',
    'Would you prioritize leisure time over additional income?'
  ),
  createCard(
    'qol_peaceful_retirement',
    'Peaceful retirement',
    'Having a calm, low-stress retirement experience.',
    'QUALITY_OF_LIFE',
    'Would you prioritize peace of mind over maximizing retirement income?'
  ),
  createCard(
    'qol_daily_enjoyment',
    'Daily enjoyment',
    'Finding joy and satisfaction in everyday life.',
    'QUALITY_OF_LIFE',
    'Would you structure finances to maximize daily satisfaction?'
  ),
];

/** All value cards combined */
export const VALUE_CARDS: ValueCard[] = [
  ...SECURITY_CARDS,
  ...FREEDOM_CARDS,
  ...FAMILY_CARDS,
  ...GROWTH_CARDS,
  ...CONTRIBUTION_CARDS,
  ...PURPOSE_CARDS,
  ...CONTROL_CARDS,
  ...HEALTH_CARDS,
  ...QUALITY_OF_LIFE_CARDS,
];

/** Get cards by category */
export function getCardsByCategory(category: ValueCategory): ValueCard[] {
  return VALUE_CARDS.filter((card) => card.category === category);
}

/** Get a card by ID */
export function getCardById(id: string): ValueCard | undefined {
  return VALUE_CARDS.find((card) => card.id === id);
}

/** Get cards by IDs */
export function getCardsByIds(ids: string[]): ValueCard[] {
  return ids.map((id) => getCardById(id)).filter((card): card is ValueCard => card !== undefined);
}

/** Category display names (for summary display only) */
export const CATEGORY_DISPLAY_NAMES: Record<ValueCategory, string> = {
  SECURITY: 'Security',
  FREEDOM: 'Freedom',
  FAMILY: 'Family',
  GROWTH: 'Growth',
  CONTRIBUTION: 'Contribution',
  PURPOSE: 'Purpose',
  CONTROL: 'Control',
  HEALTH: 'Health',
  QUALITY_OF_LIFE: 'Quality of Life',
};
