/**
 * Suggestion Templates
 * Templates for generating suggestions based on user answers
 */

import type { SuggestionTemplate, SuggestionDomain } from '@/types/suggestions';

// ============================================================
// INVESTMENTS TEMPLATES
// ============================================================

const INVESTMENTS_TEMPLATES: SuggestionTemplate[] = [
  {
    id: 'sugg_inv_rebalance_risk',
    domain: 'INVESTMENTS',
    titleTemplate: 'Review portfolio risk alignment',
    descriptionTemplate: 'Your portfolio may not be aligned with your stated risk tolerance. Consider reviewing your asset allocation to ensure it matches your comfort level with market volatility.',
    rationaleTemplate: 'Based on your analysis, your current allocation doesn\'t match your risk tolerance. This could expose you to more volatility than you\'re comfortable with, or limit your growth potential.',
    priority: 'HIGH',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'inv_risk_alignment', operator: 'equals', value: 'too_aggressive' },
    ],
  },
  {
    id: 'sugg_inv_too_conservative',
    domain: 'INVESTMENTS',
    titleTemplate: 'Evaluate if portfolio is too conservative',
    descriptionTemplate: 'Your portfolio may be more conservative than needed for your goals. Consider whether you could benefit from a more growth-oriented allocation.',
    rationaleTemplate: 'Being too conservative can limit long-term growth and may not keep pace with inflation, potentially impacting your retirement lifestyle.',
    priority: 'MEDIUM',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'inv_risk_alignment', operator: 'equals', value: 'too_conservative' },
    ],
  },
  {
    id: 'sugg_inv_diversify',
    domain: 'INVESTMENTS',
    titleTemplate: 'Improve portfolio diversification',
    descriptionTemplate: 'Consider broadening your portfolio across more asset classes to reduce concentration risk and improve risk-adjusted returns.',
    rationaleTemplate: 'Concentrated portfolios are more vulnerable to sector-specific downturns. Diversification can reduce volatility while maintaining growth potential.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'inv_diversification', operator: 'equals', value: 'concentrated' },
    ],
  },
  {
    id: 'sugg_inv_reduce_overlap',
    domain: 'INVESTMENTS',
    titleTemplate: 'Consolidate overlapping funds',
    descriptionTemplate: 'Consider consolidating funds that hold similar underlying investments to reduce unintended concentration and simplify your portfolio.',
    rationaleTemplate: 'Fund overlap can create hidden concentration risk. Consolidating similar funds reduces complexity and may lower costs.',
    priority: 'MEDIUM',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'inv_overlap', operator: 'equals', value: 'significant_overlap' },
    ],
  },
  {
    id: 'sugg_inv_improve_funds',
    domain: 'INVESTMENTS',
    titleTemplate: 'Evaluate fund replacements',
    descriptionTemplate: 'Some of your funds may have better alternatives. Research low-cost index funds or ETFs that could improve your portfolio efficiency.',
    rationaleTemplate: 'Suboptimal funds can drag on returns over time. Replacing them with better options can improve long-term outcomes.',
    priority: 'MEDIUM',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'inv_fund_quality', operator: 'equals', value: 'suboptimal' },
    ],
  },
  {
    id: 'sugg_inv_reduce_costs',
    domain: 'INVESTMENTS',
    titleTemplate: 'Reduce investment costs',
    descriptionTemplate: 'Your investment expenses are higher than necessary. Consider switching to low-cost index funds which can save thousands over time.',
    rationaleTemplate: 'High expense ratios compound against you. Even a 0.5% reduction in fees can mean tens of thousands more in retirement.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'inv_cost_efficiency', operator: 'equals', value: 'high' },
    ],
  },
  {
    id: 'sugg_inv_deploy_cash',
    domain: 'INVESTMENTS',
    titleTemplate: 'Deploy excess cash',
    descriptionTemplate: 'You may have more cash than needed sitting idle. Consider investing excess funds beyond your emergency reserve to maintain purchasing power.',
    rationaleTemplate: 'Cash above emergency fund levels loses purchasing power to inflation. Investing excess cash helps your money work for you.',
    priority: 'MEDIUM',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'inv_excess_cash', operator: 'equals', value: 'too_much' },
    ],
  },
  {
    id: 'sugg_inv_build_emergency',
    domain: 'INVESTMENTS',
    titleTemplate: 'Build emergency fund',
    descriptionTemplate: 'Your cash reserves may be insufficient for emergencies. Prioritize building a 3-6 month expense buffer before investing additional funds.',
    rationaleTemplate: 'Without adequate emergency reserves, you may be forced to sell investments at inopportune times or take on debt during financial stress.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'inv_excess_cash', operator: 'equals', value: 'too_little' },
    ],
  },
];

// ============================================================
// SAVINGS TEMPLATES
// ============================================================

const SAVINGS_TEMPLATES: SuggestionTemplate[] = [
  {
    id: 'sugg_sav_calculate_target',
    domain: 'SAVINGS',
    titleTemplate: 'Calculate your retirement savings target',
    descriptionTemplate: 'Determine a specific savings goal based on your expected expenses, income sources, and retirement timeline. This number will guide your savings decisions.',
    rationaleTemplate: 'Without a clear target, it\'s difficult to know if you\'re saving enough. A specific goal helps you track progress and make adjustments.',
    priority: 'HIGH',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'sav_retirement_target', operator: 'equals', value: 'no_target' },
    ],
  },
  {
    id: 'sugg_sav_estimate_expenses',
    domain: 'SAVINGS',
    titleTemplate: 'Create a retirement expense budget',
    descriptionTemplate: 'Develop a detailed estimate of your retirement expenses. This is foundational to all other retirement planning decisions.',
    rationaleTemplate: 'Retirement expense estimates drive savings targets, withdrawal strategies, and income planning. Without this, other planning is guesswork.',
    priority: 'HIGH',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'sav_expense_estimate', operator: 'equals', value: 'unknown' },
    ],
  },
  {
    id: 'sugg_sav_increase_guaranteed',
    domain: 'SAVINGS',
    titleTemplate: 'Evaluate increasing guaranteed income',
    descriptionTemplate: 'Your essential expenses may not be fully covered by guaranteed income. Consider strategies to increase guaranteed income sources.',
    rationaleTemplate: 'Covering essential expenses with guaranteed income (Social Security, pensions, annuities) provides security regardless of market conditions.',
    priority: 'MEDIUM',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'sav_guaranteed_coverage', operator: 'equals', value: 'minimal_coverage' },
    ],
  },
  {
    id: 'sugg_sav_catch_up',
    domain: 'SAVINGS',
    titleTemplate: 'Develop a catch-up savings plan',
    descriptionTemplate: 'You\'re behind on retirement savings. Create a plan to increase savings rate, maximize catch-up contributions, or adjust retirement timeline.',
    rationaleTemplate: 'Being behind on savings requires action now. Options include saving more, working longer, or adjusting retirement expectations.',
    priority: 'HIGH',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'sav_current_savings', operator: 'equals', value: 'significantly_behind' },
    ],
  },
  {
    id: 'sugg_sav_increase_rate',
    domain: 'SAVINGS',
    titleTemplate: 'Increase your savings rate',
    descriptionTemplate: 'Your current savings rate is below the recommended 15-20% of income. Look for ways to increase contributions to retirement accounts.',
    rationaleTemplate: 'Saving less than 15% may leave you short in retirement. Even small increases now compound significantly over time.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'sav_savings_rate', operator: 'equals', value: 'minimal' },
    ],
  },
  {
    id: 'sugg_sav_tax_diversify',
    domain: 'SAVINGS',
    titleTemplate: 'Diversify account types for tax flexibility',
    descriptionTemplate: 'Consider adding Roth or taxable accounts to give yourself more tax flexibility in retirement.',
    rationaleTemplate: 'Having money in tax-deferred, tax-free, and taxable accounts provides options to manage taxes efficiently in retirement.',
    priority: 'MEDIUM',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'sav_account_types', operator: 'equals', value: 'mostly_deferred' },
    ],
  },
  {
    id: 'sugg_sav_build_emergency',
    domain: 'SAVINGS',
    titleTemplate: 'Prioritize building emergency fund',
    descriptionTemplate: 'Your emergency fund is insufficient. Focus on building 3-6 months of expenses before maximizing retirement contributions.',
    rationaleTemplate: 'Without adequate emergency savings, unexpected expenses can derail your financial plan and force poor decisions.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'sav_emergency_fund', operator: 'equals', value: 'insufficient' },
    ],
  },
];

// ============================================================
// ANNUITIES TEMPLATES
// ============================================================

const ANNUITIES_TEMPLATES: SuggestionTemplate[] = [
  {
    id: 'sugg_ann_research_myga',
    domain: 'ANNUITIES',
    titleTemplate: 'Research MYGA opportunities',
    descriptionTemplate: 'Multi-Year Guaranteed Annuities may offer attractive rates for your safe money. Compare current MYGA rates to CDs and Treasury yields.',
    rationaleTemplate: 'MYGAs can offer higher rates than bank CDs with tax-deferred growth. They\'re worth considering for money you won\'t need for 3-10 years.',
    priority: 'LOW',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'ann_myga_evaluation', operator: 'equals', value: 'need_research' },
    ],
  },
  {
    id: 'sugg_ann_evaluate_fia',
    domain: 'ANNUITIES',
    titleTemplate: 'Get professional FIA evaluation',
    descriptionTemplate: 'Fixed Indexed Annuities are complex products. Consult with a fee-only advisor to determine if an FIA fits your situation.',
    rationaleTemplate: 'FIAs have many moving parts (caps, participation rates, surrender periods). Professional guidance helps ensure you understand what you\'re buying.',
    priority: 'MEDIUM',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'ann_fia_evaluation', operator: 'equals', value: 'need_research' },
    ],
  },
  {
    id: 'sugg_ann_analyze_income_gap',
    domain: 'ANNUITIES',
    titleTemplate: 'Analyze your income gap',
    descriptionTemplate: 'Calculate the gap between your guaranteed income and essential expenses. This will help determine if an income annuity makes sense.',
    rationaleTemplate: 'Understanding your income gap is the first step in deciding whether additional guaranteed income would benefit your retirement security.',
    priority: 'HIGH',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'ann_income_annuity', operator: 'equals', value: 'need_analysis' },
    ],
  },
  {
    id: 'sugg_ann_consider_income',
    domain: 'ANNUITIES',
    titleTemplate: 'Evaluate income annuity options',
    descriptionTemplate: 'An income annuity could help cover your essential expenses with guaranteed lifetime income. Get quotes and compare options.',
    rationaleTemplate: 'Converting some savings to guaranteed income can provide peace of mind and reduce sequence-of-returns risk in retirement.',
    priority: 'MEDIUM',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'ann_income_annuity', operator: 'equals', value: 'would_help' },
    ],
  },
];

// ============================================================
// INCOME PLAN TEMPLATES
// ============================================================

const INCOME_PLAN_TEMPLATES: SuggestionTemplate[] = [
  {
    id: 'sugg_inc_learn_buckets',
    domain: 'INCOME_PLAN',
    titleTemplate: 'Learn about bucket strategy',
    descriptionTemplate: 'Research how a bucket strategy could help you manage retirement income while staying calm during market volatility.',
    rationaleTemplate: 'A bucket approach separates short-term income needs from long-term growth, providing peace of mind during market downturns.',
    priority: 'MEDIUM',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'inc_bucket_strategy', operator: 'equals', value: 'need_learn' },
    ],
  },
  {
    id: 'sugg_inc_implement_buckets',
    domain: 'INCOME_PLAN',
    titleTemplate: 'Implement a bucket strategy',
    descriptionTemplate: 'Set up your portfolio with time-segmented buckets: cash for 1-2 years, bonds for 3-7 years, and stocks for 8+ years.',
    rationaleTemplate: 'Having 1-2 years of expenses in cash means you never have to sell stocks during a downturn to meet living expenses.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'inc_bucket_strategy', operator: 'equals', value: 'interested' },
    ],
  },
  {
    id: 'sugg_inc_create_withdrawal_plan',
    domain: 'INCOME_PLAN',
    titleTemplate: 'Create a written withdrawal strategy',
    descriptionTemplate: 'Document your income strategy: which accounts to draw from, in what order, and how to adjust for market conditions.',
    rationaleTemplate: 'A written plan reduces emotional decision-making and provides a roadmap for consistent income management.',
    priority: 'HIGH',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'inc_withdrawal_strategy', operator: 'equals', value: 'no_plan' },
    ],
  },
  {
    id: 'sugg_inc_analyze_ss',
    domain: 'INCOME_PLAN',
    titleTemplate: 'Analyze Social Security timing',
    descriptionTemplate: 'Run the numbers on different Social Security claiming ages. This is often the highest-impact retirement income decision.',
    rationaleTemplate: 'Delaying Social Security increases benefits 8% per year from 62 to 70. For many, this is the best "investment" available.',
    priority: 'HIGH',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'inc_social_security_timing', operator: 'equals', value: 'not_analyzed' },
    ],
  },
];

// ============================================================
// TAXES TEMPLATES
// ============================================================

const TAXES_TEMPLATES: SuggestionTemplate[] = [
  {
    id: 'sugg_tax_analyze_roth',
    domain: 'TAXES',
    titleTemplate: 'Analyze Roth conversion opportunities',
    descriptionTemplate: 'Evaluate whether Roth conversions make sense for your situation. Consider your current vs. future tax brackets and RMD impact.',
    rationaleTemplate: 'Roth conversions can reduce future taxes, lower RMDs, and provide tax-free income in retirement. The analysis requires careful modeling.',
    priority: 'HIGH',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'tax_roth_conversion', operator: 'equals', value: 'need_analysis' },
    ],
  },
  {
    id: 'sugg_tax_implement_conversions',
    domain: 'TAXES',
    titleTemplate: 'Implement Roth conversion strategy',
    descriptionTemplate: 'You\'ve identified Roth conversions as beneficial. Work with a tax professional to implement an annual conversion strategy.',
    rationaleTemplate: 'Converting in lower-bracket years, especially between retirement and age 73, can significantly reduce lifetime taxes.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'tax_roth_conversion', operator: 'equals', value: 'makes_sense' },
    ],
  },
  {
    id: 'sugg_tax_get_review',
    domain: 'TAXES',
    titleTemplate: 'Get a proactive tax review',
    descriptionTemplate: 'Have a tax professional review your situation for opportunities to reduce taxes through timing, deductions, and account strategies.',
    rationaleTemplate: 'Many people overpay taxes due to missed opportunities. A proactive review can identify savings you didn\'t know existed.',
    priority: 'MEDIUM',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'tax_overpaying', operator: 'equals', value: 'likely_overpaying' },
    ],
  },
  {
    id: 'sugg_tax_capital_gains_strategy',
    domain: 'TAXES',
    titleTemplate: 'Develop capital gains management strategy',
    descriptionTemplate: 'Create a plan for managing your appreciated assets: tax-loss harvesting, charitable giving, and timing of sales.',
    rationaleTemplate: 'Strategic management of capital gains can significantly reduce taxes. In retirement, you may access the 0% capital gains bracket.',
    priority: 'MEDIUM',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'tax_capital_gains', operator: 'equals', value: 'significant_gains' },
    ],
  },
  {
    id: 'sugg_tax_inheritance_planning',
    domain: 'TAXES',
    titleTemplate: 'Plan for tax-efficient inheritance',
    descriptionTemplate: 'Structure your accounts and drawdown strategy to minimize the tax burden on your heirs.',
    rationaleTemplate: 'Different account types have vastly different tax implications for heirs. Planning now can save your beneficiaries significant taxes.',
    priority: 'LOW',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'tax_estate_planning', operator: 'equals', value: 'not_considered' },
    ],
  },
];

// ============================================================
// ESTATE PLAN TEMPLATES
// ============================================================

const ESTATE_PLAN_TEMPLATES: SuggestionTemplate[] = [
  {
    id: 'sugg_est_create_will',
    domain: 'ESTATE_PLAN',
    titleTemplate: 'Create or update your will',
    descriptionTemplate: 'Establish a valid will that specifies how your assets should be distributed and names guardians for minor children if applicable.',
    rationaleTemplate: 'Without a will, state law determines asset distribution. A will ensures your wishes are followed and makes things easier for your family.',
    priority: 'HIGH',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'est_will', operator: 'equals', value: 'none' },
    ],
  },
  {
    id: 'sugg_est_update_will',
    domain: 'ESTATE_PLAN',
    titleTemplate: 'Update your outdated will',
    descriptionTemplate: 'Review and update your will to reflect current circumstances, relationships, and wishes.',
    rationaleTemplate: 'Outdated wills can cause unintended consequences. Life changes should trigger a review of estate documents.',
    priority: 'MEDIUM',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'est_will', operator: 'equals', value: 'outdated' },
    ],
  },
  {
    id: 'sugg_est_evaluate_trust',
    domain: 'ESTATE_PLAN',
    titleTemplate: 'Evaluate trust options',
    descriptionTemplate: 'Consult with an estate attorney to determine if a trust would benefit your situation for probate avoidance, asset protection, or control.',
    rationaleTemplate: 'Trusts can avoid probate, protect assets, and control how heirs receive money. An attorney can advise if one is right for you.',
    priority: 'MEDIUM',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'est_trust', operator: 'equals', value: 'need_evaluation' },
    ],
  },
  {
    id: 'sugg_est_healthcare_directives',
    domain: 'ESTATE_PLAN',
    titleTemplate: 'Complete healthcare directives',
    descriptionTemplate: 'Create a healthcare power of attorney and living will to ensure your medical wishes are followed if you cannot communicate them.',
    rationaleTemplate: 'Without these documents, family members may face difficult decisions or court proceedings during an already stressful time.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'est_poa_healthcare', operator: 'equals', value: 'none' },
    ],
  },
  {
    id: 'sugg_est_financial_poa',
    domain: 'ESTATE_PLAN',
    titleTemplate: 'Establish durable financial power of attorney',
    descriptionTemplate: 'Create a durable financial POA so someone you trust can manage your finances if you become incapacitated.',
    rationaleTemplate: 'Without a financial POA, a court must appoint a guardian to handle your finances, which is costly and time-consuming.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'est_financial_poa', operator: 'equals', value: 'none' },
    ],
  },
  {
    id: 'sugg_est_review_beneficiaries',
    domain: 'ESTATE_PLAN',
    titleTemplate: 'Review all beneficiary designations',
    descriptionTemplate: 'Check and update beneficiaries on all retirement accounts, life insurance, and transfer-on-death accounts.',
    rationaleTemplate: 'Beneficiary designations override your will. Outdated beneficiaries (like ex-spouses) can cause assets to go to unintended people.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'est_beneficiaries', operator: 'equals', value: 'not_reviewed' },
    ],
  },
];

// ============================================================
// INSURANCE TEMPLATES
// ============================================================

const INSURANCE_TEMPLATES: SuggestionTemplate[] = [
  {
    id: 'sugg_ins_review_health',
    domain: 'INSURANCE',
    titleTemplate: 'Review health insurance options',
    descriptionTemplate: 'Evaluate your health insurance coverage and costs. Look for opportunities to optimize your plan choice.',
    rationaleTemplate: 'Health insurance is a major expense. Ensuring you have the right coverage at a good price is important for financial security.',
    priority: 'MEDIUM',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'ins_health_coverage', operator: 'equals', value: 'need_review' },
    ],
  },
  {
    id: 'sugg_ins_pre_medicare_plan',
    domain: 'INSURANCE',
    titleTemplate: 'Plan for pre-Medicare health coverage',
    descriptionTemplate: 'If retiring before 65, research options for bridging the gap to Medicare: COBRA, ACA marketplace, spouse coverage, or private insurance.',
    rationaleTemplate: 'Health insurance before Medicare eligibility can be expensive. Planning ahead helps you budget and find the best option.',
    priority: 'HIGH',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'ins_health_coverage', operator: 'equals', value: 'gap_before_medicare' },
    ],
  },
  {
    id: 'sugg_ins_evaluate_life',
    domain: 'INSURANCE',
    titleTemplate: 'Evaluate life insurance needs',
    descriptionTemplate: 'Calculate your life insurance need based on income replacement, debts, and dependent support. Compare to current coverage.',
    rationaleTemplate: 'Life insurance needs change over time. Regular evaluation ensures you\'re not underinsured or overpaying for unnecessary coverage.',
    priority: 'MEDIUM',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'ins_life_insurance', operator: 'equals', value: 'need_analysis' },
    ],
  },
  {
    id: 'sugg_ins_increase_life',
    domain: 'INSURANCE',
    titleTemplate: 'Consider additional life insurance',
    descriptionTemplate: 'Your current life insurance may be insufficient to protect your family. Get quotes for term insurance to fill the gap.',
    rationaleTemplate: 'Adequate life insurance ensures your family can maintain their lifestyle and meet financial obligations if something happens to you.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'ins_life_insurance', operator: 'equals', value: 'underinsured' },
    ],
  },
  {
    id: 'sugg_ins_review_disability',
    domain: 'INSURANCE',
    titleTemplate: 'Review disability insurance coverage',
    descriptionTemplate: 'Evaluate if your disability coverage is adequate. Consider supplemental coverage if employer benefits are limited.',
    rationaleTemplate: 'Disability is more common than death during working years. Adequate coverage protects your income and financial plan.',
    priority: 'MEDIUM',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'ins_disability', operator: 'equals', value: 'employer_only' },
    ],
  },
  {
    id: 'sugg_ins_ltc_planning',
    domain: 'INSURANCE',
    titleTemplate: 'Develop long-term care plan',
    descriptionTemplate: 'Evaluate options for paying for potential long-term care: traditional LTC insurance, hybrid policies, or self-insurance with dedicated assets.',
    rationaleTemplate: 'Long-term care costs can devastate retirement savings. Having a plan provides peace of mind and protects your spouse.',
    priority: 'MEDIUM',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'ins_ltc', operator: 'equals', value: 'need_coverage' },
    ],
  },
  {
    id: 'sugg_ins_pension_max',
    domain: 'INSURANCE',
    titleTemplate: 'Analyze pension maximization strategy',
    descriptionTemplate: 'Compare taking a higher single-life pension with life insurance versus the reduced joint-and-survivor pension option.',
    rationaleTemplate: 'If you\'re healthy and insurable, pension max may provide more total income while still protecting your spouse.',
    priority: 'MEDIUM',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'ins_pension_max', operator: 'equals', value: 'not_evaluated' },
    ],
  },
];

// ============================================================
// EMPLOYEE BENEFITS TEMPLATES
// ============================================================

const EMPLOYEE_BENEFITS_TEMPLATES: SuggestionTemplate[] = [
  {
    id: 'sugg_ben_get_full_match',
    domain: 'EMPLOYEE_BENEFITS',
    titleTemplate: 'Increase contributions to get full match',
    descriptionTemplate: 'You\'re leaving free money on the table. Increase your 401k/TSP contribution to capture the full employer match.',
    rationaleTemplate: 'The employer match is an immediate 50-100% return on your contribution. Not getting it is like declining a raise.',
    priority: 'HIGH',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'ben_401k_match', operator: 'equals', value: 'not_full' },
    ],
  },
  {
    id: 'sugg_ben_compare_fegli',
    domain: 'EMPLOYEE_BENEFITS',
    titleTemplate: 'Compare FEGLI to private insurance',
    descriptionTemplate: 'Get quotes for private term insurance and compare to your FEGLI costs, especially Option B which increases with age.',
    rationaleTemplate: 'FEGLI Option B becomes expensive as you age. Private term insurance is often much cheaper, especially if you\'re healthy.',
    priority: 'MEDIUM',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'ben_fegli', operator: 'equals', value: 'not_compared' },
    ],
  },
  {
    id: 'sugg_ben_fegli_retirement_plan',
    domain: 'EMPLOYEE_BENEFITS',
    titleTemplate: 'Plan FEGLI transition for retirement',
    descriptionTemplate: 'Understand what happens to your FEGLI coverage at retirement. Consider locking in private coverage before you retire.',
    rationaleTemplate: 'FEGLI Option B reduces at 65 unless you pay expensive premiums. Planning ahead ensures continuous coverage.',
    priority: 'HIGH',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'ben_fegli_portability', operator: 'equals', value: 'not_clear' },
    ],
  },
  {
    id: 'sugg_ben_survivor_analysis',
    domain: 'EMPLOYEE_BENEFITS',
    titleTemplate: 'Analyze FERS survivor benefit options',
    descriptionTemplate: 'Run the numbers on full, partial, and no survivor annuity options. Compare to life insurance alternatives.',
    rationaleTemplate: 'The survivor benefit decision is irrevocable and affects your pension for life. Careful analysis is essential.',
    priority: 'HIGH',
    actionType: 'CONSULT_PROFESSIONAL',
    triggerConditions: [
      { questionId: 'ben_survivor_benefits', operator: 'equals', value: 'not_evaluated' },
    ],
  },
  {
    id: 'sugg_ben_retirement_timing',
    domain: 'EMPLOYEE_BENEFITS',
    titleTemplate: 'Optimize your retirement date',
    descriptionTemplate: 'Use a federal retirement calculator to analyze optimal retirement timing considering pension, FERS supplement, and leave payout.',
    rationaleTemplate: 'Small timing differences can have big financial impacts. Retiring at the right time can maximize your benefits.',
    priority: 'MEDIUM',
    actionType: 'INVESTIGATE',
    triggerConditions: [
      { questionId: 'ben_pension_timing', operator: 'equals', value: 'not_analyzed' },
    ],
  },
  {
    id: 'sugg_ben_review_tsp',
    domain: 'EMPLOYEE_BENEFITS',
    titleTemplate: 'Review and update TSP allocation',
    descriptionTemplate: 'Evaluate your TSP allocation to ensure it matches your investment strategy. Consider whether it\'s too conservative.',
    rationaleTemplate: 'Many federal employees are over-allocated to the G fund. Ensuring your TSP matches your goals is important.',
    priority: 'MEDIUM',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'ben_tsp_allocation', operator: 'equals', value: 'not_reviewed' },
    ],
  },
  {
    id: 'sugg_ben_tsp_too_conservative',
    domain: 'EMPLOYEE_BENEFITS',
    titleTemplate: 'Consider more aggressive TSP allocation',
    descriptionTemplate: 'Your TSP may be too conservatively allocated. Review whether you should shift toward more growth-oriented funds.',
    rationaleTemplate: 'Being too conservative in TSP limits long-term growth. If you have time until retirement, consider more equity exposure.',
    priority: 'MEDIUM',
    actionType: 'IMPLEMENT',
    triggerConditions: [
      { questionId: 'ben_tsp_allocation', operator: 'equals', value: 'too_conservative' },
    ],
  },
];

// ============================================================
// ALL TEMPLATES
// ============================================================

export const SUGGESTION_TEMPLATES: SuggestionTemplate[] = [
  ...INVESTMENTS_TEMPLATES,
  ...SAVINGS_TEMPLATES,
  ...ANNUITIES_TEMPLATES,
  ...INCOME_PLAN_TEMPLATES,
  ...TAXES_TEMPLATES,
  ...ESTATE_PLAN_TEMPLATES,
  ...INSURANCE_TEMPLATES,
  ...EMPLOYEE_BENEFITS_TEMPLATES,
];

/**
 * Get templates by domain
 */
export function getTemplatesByDomain(domain: SuggestionDomain): SuggestionTemplate[] {
  return SUGGESTION_TEMPLATES.filter((t) => t.domain === domain);
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(templateId: string): SuggestionTemplate | undefined {
  return SUGGESTION_TEMPLATES.find((t) => t.id === templateId);
}
