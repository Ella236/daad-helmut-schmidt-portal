export type DocStatus = "Valid" | "Invalid" | "Unchecked";

export interface AIStep {
  label: string;
  description: string;
  result: "pass" | "fail" | "warn" | "skip";
  detail: string;
}

export interface AIAnalysis {
  status: DocStatus;
  confidence: number;
  steps: AIStep[];
  findings: string[];
  issues: string[];
}

export interface Document {
  id: string;
  type: string;
  filename: string;
  confirmation: string;
  status: DocStatus;
  aiAnalysis: AIAnalysis;
  pages?: number;
}

export interface Applicant {
  id: string;
  applicantNo: string;
  lastName: string;
  firstName: string;
  gender: "male" | "female";
  nationality: string;
  email: string;
  address: string;
  phone: string;
  requestStatus: string;
  semester: string;
  programme: string;
  documents: Document[];
}

/* ── DAAD Formal Criteria (from official checklist ST42 04/2026) ─────
   1. Complete document set incl. signed checklist
   2. Typed DAAD application form; info must match across all docs
   3. Degree with above-average grades (upper third of cohort)
   4. Practical experience relevant to HSP goals (headed paper, original
      or code-certified signature, date, stamp)
   5. Second master's: must justify additional postgraduate study
   6. Last degree issued no earlier than 1 January 2020 (≤6 years)
   7. Not more than 15 months in a non-DAC-list country
   ─────────────────────────────────────────────────────────────────── */

const makeSteps = {
  applicationForm: (): AIStep[] => [
    { label: "Document detection", description: "Check file is present, readable, and not corrupted", result: "pass", detail: "PDF parsed successfully — 2 pages" },
    { label: "Language compliance", description: "Document must be in German or English", result: "pass", detail: "Language identified: English" },
    { label: "Answer format", description: "Answers must be typed, not handwritten", result: "pass", detail: "All fields contain typed text" },
    { label: "Field completeness", description: "All mandatory fields must be filled", result: "pass", detail: "All 12 required fields present" },
    { label: "Information consistency", description: "Name, DOB, email must match across all submitted documents", result: "pass", detail: "Cross-referenced with CV and passport — no discrepancies" },
    { label: "Hand signature", description: "Page 2 must carry an original hand signature", result: "pass", detail: "Signature detected on page 2 with date and place" },
  ],
  checklist: (): AIStep[] => [
    { label: "Document detection", description: "Checklist file present and readable", result: "pass", detail: "PDF parsed — 2 pages" },
    { label: "Original hand signature", description: "Must be printed, signed by hand, and scanned back", result: "pass", detail: "Hand signature detected" },
    { label: "All boxes ticked", description: "All applicable mandatory checkboxes must be ticked", result: "pass", detail: "10 mandatory items confirmed ticked" },
    { label: "Applicant name present", description: "Applicant name field on checklist must match application form", result: "pass", detail: "Name matches application form" },
    { label: "Date and signature", description: "Date, place, and printed name + signature at bottom required", result: "pass", detail: "All signature block elements present" },
  ],
  motivation: (issues: string[] = []): AIStep[] => [
    { label: "Document detection", description: "File present and readable", result: "pass", detail: "PDF parsed" },
    { label: "Language compliance", description: "Must be in German or English", result: "pass", detail: "Language: English" },
    { label: "Page limit", description: "Must not exceed 2 pages", result: issues.includes("exceeds") ? "fail" : "pass", detail: issues.includes("exceeds") ? "3 pages detected — exceeds 2-page maximum" : "2 pages — within limit" },
    { label: "Date of issue", description: "Date of issue must be explicitly stated in the document", result: issues.includes("nodate") ? "fail" : "pass", detail: issues.includes("nodate") ? "No date found in document" : "Date found: 24 January 2026" },
    { label: "Selection criteria addressed", description: "Must explain academic, professional, and personal reasons for applying", result: "pass", detail: "All three motivation dimensions identified in text" },
    { label: "HSP goal alignment", description: "Must address how motivation relates to HSP programme goals", result: "pass", detail: "HSP relevance section detected" },
    { label: "Practical experience addressed", description: "Must address relevant professional/community experience", result: "pass", detail: "Work and voluntary experience referenced" },
    { label: "Hand signature", description: "Document must be hand-signed", result: "pass", detail: "Signature detected" },
  ],
  cv: (issues: string[] = []): AIStep[] => [
    { label: "Document detection", description: "File present and readable", result: "pass", detail: "PDF parsed" },
    { label: "Europass format", description: "CV must follow the official Europass template", result: issues.includes("format") ? "fail" : "pass", detail: issues.includes("format") ? "Europass structure not detected — custom format used" : "Europass template confirmed" },
    { label: "Reverse chronological order", description: "Experience and education entries must be in reverse chronological order", result: issues.includes("order") ? "fail" : "pass", detail: issues.includes("order") ? "Entries appear to be in chronological order" : "Entries are in correct reverse chronological order" },
    { label: "Employment gaps ≥3 months", description: "Any gap of 3 months or more must be explained in the CV", result: issues.includes("gap") ? "fail" : "pass", detail: issues.includes("gap") ? "Gap of 8 months (Mar 2023 – Nov 2023) not explained" : "No unexplained gaps of 3 months or more detected" },
    { label: "Date of issue", description: "Europass template omits date — applicant must add it manually", result: issues.includes("nodate") ? "fail" : "pass", detail: issues.includes("nodate") ? "Date of issue missing from document" : "Date of issue manually added: January 2026" },
    { label: "Hand signature", description: "CV must be hand-signed", result: "pass", detail: "Signature detected" },
    { label: "Information consistency", description: "Employment dates and positions must match reference letters and application form", result: "pass", detail: "Consistent with submitted reference letter" },
  ],
  degree: (issues: string[] = []): AIStep[] => [
    { label: "Document detection", description: "Degree certificate present and readable", result: "pass", detail: "PDF parsed" },
    { label: "Language compliance", description: "If original is not in German or English, a certified translation must be included", result: issues.includes("translation") ? "fail" : "pass", detail: issues.includes("translation") ? "Document in non-German/English language; no certified translation found" : "Document in English — no translation required" },
    { label: "Grade level", description: "Degree must be completed with above-average grades (upper third of cohort)", result: issues.includes("grades") ? "warn" : "pass", detail: issues.includes("grades") ? "Grade information unclear — manual verification required" : "CGPA 3.45/4.00 — upper third confirmed" },
    { label: "Degree recency", description: "Last university degree must not date back more than 6 years (not before 1 Jan 2020)", result: issues.includes("old") ? "fail" : "pass", detail: issues.includes("old") ? "Degree issued 2017 — exceeds 6-year maximum" : "Degree awarded 2023 — within 6-year limit" },
    { label: "Second master's justification", description: "If applicant already holds a master's degree, a well-argued justification is required", result: "skip", detail: "Applicant holds only a bachelor's degree — check not applicable" },
    { label: "Institutional authentication", description: "Certificate must carry official stamp and authorised signature", result: issues.includes("stamp") ? "fail" : "pass", detail: issues.includes("stamp") ? "No institutional stamp detected — possible photocopy" : "Stamp and registrar signature present" },
    { label: "Confirmation letter", description: "If official certificate not yet available, confirmation from university required instead", result: "skip", detail: "Official certificate submitted — no confirmation letter needed" },
  ],
  transcript: (issues: string[] = []): AIStep[] => [
    { label: "Document detection", description: "Transcript file present and readable", result: "pass", detail: "PDF parsed" },
    { label: "Full set of transcripts", description: "Must include all semesters / academic years — partial sets are not accepted", result: issues.includes("incomplete") ? "fail" : "pass", detail: issues.includes("incomplete") ? "Only 2 of 4 academic years present" : "All 4 academic years present" },
    { label: "Grading system explanation", description: "If grading system is not explained within the transcript, a separate explanation is required", result: issues.includes("grading") ? "fail" : "pass", detail: issues.includes("grading") ? "No grading scale explanation found" : "Grading scale explanation included on final page" },
    { label: "Language compliance", description: "If original not in German or English, a certified translation must be provided", result: issues.includes("translation") ? "fail" : "pass", detail: issues.includes("translation") ? "Transcript in local language; no certified translation attached" : "Document in English — no translation required" },
    { label: "Institutional authentication", description: "Must bear official university stamp and authorised signature", result: issues.includes("stamp") ? "warn" : "pass", detail: issues.includes("stamp") ? "Stamp present but signature appears to be a photocopy" : "Stamp and registrar signature confirmed" },
    { label: "Grade consistency with degree", description: "Overall GPA on transcript must match degree certificate", result: "pass", detail: "CGPA 3.45 consistent with degree certificate" },
  ],
  practicalExp: (issues: string[] = []): AIStep[] => [
    { label: "Document detection", description: "At least one proof of practical experience present", result: "pass", detail: "2 documents uploaded (professional + voluntary)" },
    { label: "Headed paper", description: "All confirmations must be on official headed/letterhead paper", result: issues.includes("header") ? "fail" : "pass", detail: issues.includes("header") ? "Document not on headed paper" : "Official letterhead detected on both documents" },
    { label: "Signature type", description: "Must be original (not scanned) or code-certified digital signature — photocopied signatures not accepted", result: issues.includes("scanned") ? "fail" : "pass", detail: issues.includes("scanned") ? "Signature appears to be a scanned photocopy" : "Original digital signature verified" },
    { label: "Date of issue", description: "Date of issue must be explicitly stated", result: "pass", detail: "Date of issue present on both documents" },
    { label: "Institutional stamp", description: "Stamp from issuing organisation required", result: issues.includes("stamp") ? "fail" : "pass", detail: issues.includes("stamp") ? "No stamp detected" : "Stamps present on both documents" },
    { label: "Relevance to HSP goals", description: "Experience must be professionally or politically relevant to the programme's goals", result: "pass", detail: "Professional development sector experience and community NGO work — both relevant to social protection programme" },
    { label: "Language compliance", description: "If not in German or English, certified translation required", result: "pass", detail: "Documents in English — no translation required" },
  ],
  reference: (issues: string[] = []): AIStep[] => [
    { label: "Document detection", description: "Reference letter file present and readable", result: "pass", detail: "PDF parsed" },
    { label: "Author eligibility", description: "Must be from current employer, or from a university lecturer if applicant is currently a student", result: issues.includes("source") ? "fail" : "pass", detail: issues.includes("source") ? "Author's position or organisation unclear" : "Letter authored by direct supervisor at current employer" },
    { label: "Headed paper", description: "Must be written on official headed/letterhead paper", result: issues.includes("header") ? "fail" : "pass", detail: issues.includes("header") ? "No letterhead detected" : "Official company letterhead confirmed" },
    { label: "Signature type", description: "Original (not scanned) or code-certified digital signature — photocopied signatures not accepted", result: issues.includes("scanned") ? "fail" : "pass", detail: issues.includes("scanned") ? "Signature is a photocopy — original or digital required" : "Original digital signature detected" },
    { label: "Date of issue", description: "Date of issue must be clearly stated", result: "pass", detail: "Date of issue present" },
    { label: "Institutional stamp", description: "Official stamp from the organisation required", result: issues.includes("stamp") ? "fail" : "pass", detail: issues.includes("stamp") ? "No stamp detected" : "Organisational stamp present" },
    { label: "Content relevance", description: "Reference must speak to the applicant's professional or academic performance", result: "pass", detail: "Reference addresses performance, role responsibilities, and recommendation" },
  ],
  language: (issues: string[] = []): AIStep[] => [
    { label: "Document detection", description: "English language certificate present and readable", result: "pass", detail: "PDF parsed" },
    { label: "Recognised test", description: "Must be a recognised English proficiency test (IELTS, TOEFL, Cambridge, PTE, etc.)", result: issues.includes("unrecognised") ? "fail" : "pass", detail: issues.includes("unrecognised") ? "Test provider not recognised" : "IELTS Academic recognised" },
    { label: "Score threshold", description: "Score must meet the minimum requirement for the applied programme", result: issues.includes("lowscore") ? "fail" : "pass", detail: issues.includes("lowscore") ? "Score below programme minimum" : "IELTS 7.0 — meets minimum requirement" },
    { label: "Certificate validity", description: "Certificate must be within validity period (IELTS/TOEFL valid for 2 years)", result: issues.includes("expired") ? "fail" : "pass", detail: issues.includes("expired") ? "Certificate expired" : "Valid until March 2027" },
    { label: "Official certificate", description: "Must be an official test result certificate, not self-reported", result: "pass", detail: "Official IELTS Test Report Form confirmed" },
    { label: "Name match", description: "Name on certificate must match application form and passport", result: "pass", detail: "Name consistent across documents" },
  ],
  passport: (): AIStep[] => [
    { label: "Document detection", description: "Passport copy present and readable", result: "pass", detail: "PDF parsed" },
    { label: "Data page present", description: "Biographical data page must be clearly visible", result: "pass", detail: "Photo and data page confirmed" },
    { label: "Validity", description: "Passport must be valid (not expired)", result: "pass", detail: "Expiry: March 2032 — valid" },
    { label: "Name match", description: "Passport name must exactly match DAAD application form", result: "pass", detail: "Name matches application form exactly" },
    { label: "Nationality eligibility", description: "Applicant must be from a DAC-eligible country", result: "pass", detail: "Bangladesh is on the DAC list — eligible" },
    { label: "15-month residency check", description: "Applicant must not have spent more than 15 months in a non-DAC country", result: "pass", detail: "Current residence in Bangladesh confirmed" },
  ],
};

export const applicants: Applicant[] = [
  {
    id: "1",
    applicantNo: "120967",
    lastName: "HASAN",
    firstName: "MD MORSHED",
    gender: "male",
    nationality: "Bangladesh",
    email: "morshedhasan.bu@gmail.com",
    address: "3376/01 South Palordi, Gournadi, 8230 Barishal",
    phone: "+8801700898470",
    requestStatus: "Received",
    semester: "Winter Semester 2027/28",
    programme: "Helmut-Schmidt-Programme (Social Protection)",
    documents: [
      {
        id: "d1", type: "Application Form", filename: "DAAD Application Form.pdf",
        confirmation: "The document is hand-signed.", status: "Valid", pages: 2,
        aiAnalysis: { status: "Valid", confidence: 94, steps: makeSteps.applicationForm(), findings: ["Typed answers", "All fields completed", "Hand-signed page 2", "Date: 24/01/2026, Barishal", "Info consistent across documents"], issues: [] },
      },
      {
        id: "d2", type: "Checklist", filename: "DAAD Checklist form.pdf",
        confirmation: "The document is hand-signed.", status: "Valid",
        aiAnalysis: { status: "Valid", confidence: 91, steps: makeSteps.checklist(), findings: ["Hand-signed", "All mandatory boxes ticked", "Applicant name matches application form", "Signature block complete"], issues: [] },
      },
      {
        id: "d3", type: "Letter of Motivation", filename: "Letter of Motivation.pdf",
        confirmation: "The document is hand-signed.", status: "Valid", pages: 2,
        aiAnalysis: { status: "Valid", confidence: 88, steps: makeSteps.motivation(), findings: ["2 pages — within limit", "Date of issue present", "All three motivation dimensions addressed", "HSP goal alignment confirmed", "Hand-signed"], issues: [] },
      },
      {
        id: "d4", type: "CV", filename: "Europass CV of Md Morshed Hasan.pdf",
        confirmation: "The document is in Europass format and hand-signed.", status: "Valid",
        aiAnalysis: { status: "Valid", confidence: 90, steps: makeSteps.cv(), findings: ["Europass format confirmed", "Reverse chronological order", "No unexplained gaps ≥3 months", "Date of issue present", "Hand-signed", "Consistent with reference letter"], issues: [] },
      },
      {
        id: "d5", type: "University Degree", filename: "GRADUATION CERTIFICATE.pdf",
        confirmation: "The document is signed and stamped.", status: "Valid",
        aiAnalysis: { status: "Valid", confidence: 88, steps: makeSteps.degree(), findings: ["English — no translation needed", "CGPA 3.45/4.00 — upper third", "Degree 2023 — within 6-year limit", "Stamp and registrar signature present"], issues: [] },
      },
      {
        id: "d6", type: "Transcript", filename: "TRANSCRIPT.pdf",
        confirmation: "Full set of transcripts included.", status: "Valid",
        aiAnalysis: { status: "Valid", confidence: 85, steps: makeSteps.transcript(), findings: ["All 4 academic years present", "Grading scale explanation on final page", "English — no translation needed", "Stamp and signature confirmed", "CGPA consistent with degree"], issues: [] },
      },
      {
        id: "d7", type: "Practical Experience", filename: "Work Experience Certificate.pdf",
        confirmation: "Signed and stamped, translated to English.", status: "Valid",
        aiAnalysis: { status: "Valid", confidence: 86, steps: makeSteps.practicalExp(), findings: ["Official letterhead on both docs", "Original digital signature", "Date of issue present", "Stamps present", "Relevant to HSP social protection goals"], issues: [] },
      },
      {
        id: "d8", type: "Voluntary Certificate", filename: "Voluntary Certificate.pdf",
        confirmation: "Signed and stamped, translated to English.", status: "Valid",
        aiAnalysis: { status: "Valid", confidence: 82, steps: makeSteps.practicalExp(), findings: ["Community NGO work on headed paper", "Stamp and signature confirmed", "English — no translation required"], issues: [] },
      },
      {
        id: "d9", type: "Written Reference", filename: "Reference Letter.pdf",
        confirmation: "From current employer, on headed paper.", status: "Valid",
        aiAnalysis: { status: "Valid", confidence: 87, steps: makeSteps.reference(), findings: ["Current employer reference", "Official letterhead", "Original digital signature", "Date and stamp present", "Performance and recommendation addressed"], issues: [] },
      },
      {
        id: "d10", type: "English Language Proof", filename: "Medium of Instruction.pdf",
        confirmation: "Medium of instruction certificate.", status: "Unchecked",
        aiAnalysis: {
          status: "Unchecked", confidence: 55, steps: [
            ...makeSteps.language(["unrecognised"]).slice(0, 1),
            { label: "Recognised test", description: "Must be IELTS, TOEFL, Cambridge, PTE, etc.", result: "warn", detail: "Medium of Instruction certificate is not a standard proficiency test — may not meet formal requirement" },
            { label: "Score threshold", description: "Score must meet programme minimum", result: "warn", detail: "No numeric score available from this document type" },
            { label: "Certificate validity", description: "Must be within validity period", result: "warn", detail: "Medium of Instruction letters typically have no expiry — validity unclear" },
            { label: "Official certificate", description: "Must be official test result", result: "warn", detail: "This is a university confirmation, not a standardised test certificate" },
            { label: "Name match", description: "Name on certificate must match application", result: "pass", detail: "Name matches application form" },
          ],
          findings: ["Document uploaded", "Name matches application form"],
          issues: ["Medium of Instruction may not substitute for IELTS/TOEFL — manual review required", "No standardised proficiency score available"],
        },
      },
      {
        id: "d11", type: "Passport", filename: "PASSPORT.pdf",
        confirmation: "Copy of valid passport.", status: "Valid",
        aiAnalysis: { status: "Valid", confidence: 97, steps: makeSteps.passport(), findings: ["Data page clearly visible", "Expiry: March 2032", "Name matches application form", "Bangladesh — DAC eligible", "Residency in Bangladesh confirmed"], issues: [] },
      },
    ],
  },
  {
    id: "2",
    applicantNo: "106243",
    lastName: "Abbas",
    firstName: "Manzar",
    gender: "male",
    nationality: "Pakistan (Isl. Rep.)",
    email: "manzarshah68@gmail.com",
    address: "House 12, Street 4, F-7/1, Islamabad",
    phone: "+92300123456",
    requestStatus: "Received",
    semester: "Winter Semester 2027/28",
    programme: "Helmut-Schmidt-Programme (Social Protection)",
    documents: [
      { id: "d1", type: "Application Form", filename: "AppForm_Manzar.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 92, steps: makeSteps.applicationForm(), findings: ["Typed answers", "All fields present", "Hand-signed"], issues: [] } },
      { id: "d2", type: "Checklist", filename: "Checklist_Manzar.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 89, steps: makeSteps.checklist(), findings: ["Signed checklist, all boxes ticked"], issues: [] } },
      { id: "d3", type: "Letter of Motivation", filename: "Motivation_Manzar.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 85, steps: makeSteps.motivation(), findings: ["2 pages", "Date present", "All criteria addressed", "Hand-signed"], issues: [] } },
      { id: "d4", type: "CV", filename: "Europass_CV_Manzar.pdf", confirmation: "Europass format.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 87, steps: makeSteps.cv(), findings: ["Europass confirmed", "Reverse chronological", "Date of issue present"], issues: [] } },
      {
        id: "d5", type: "University Degree", filename: "Degree_Manzar.pdf", confirmation: "Degree certificate.", status: "Invalid",
        aiAnalysis: {
          status: "Invalid", confidence: 88,
          steps: makeSteps.degree(["translation", "stamp"]),
          findings: ["Degree certificate uploaded"],
          issues: ["Document in Urdu — certified translation into German or English required but not provided", "No institutional stamp detected — appears to be an unauthenticated photocopy"],
        },
      },
      {
        id: "d6", type: "Transcript", filename: "Transcript_Manzar.pdf", confirmation: "Partial transcripts.", status: "Invalid",
        aiAnalysis: {
          status: "Invalid", confidence: 84,
          steps: makeSteps.transcript(["incomplete", "grading", "translation"]),
          findings: [],
          issues: ["Only 2 of 4 academic years submitted — full set required", "No grading system explanation provided", "Transcript in Urdu — certified translation required"],
        },
      },
      { id: "d7", type: "Practical Experience", filename: "WorkExp_Manzar.pdf", confirmation: "On headed paper.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 84, steps: makeSteps.practicalExp(), findings: ["Headed paper", "Signature and stamp", "Date present", "Relevant experience"], issues: [] } },
      { id: "d8", type: "Written Reference", filename: "Ref_Manzar.pdf", confirmation: "Employer reference.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 86, steps: makeSteps.reference(), findings: ["Current employer", "Headed paper", "Signature and stamp", "Date present"], issues: [] } },
      { id: "d9", type: "English Language Proof", filename: "IELTS_Manzar.pdf", confirmation: "IELTS certificate.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 95, steps: makeSteps.language(), findings: ["IELTS 7.0 — above minimum", "Valid until 2027", "Name matches application"], issues: [] } },
      { id: "d10", type: "Passport", filename: "Passport_Manzar.pdf", confirmation: "Valid passport copy.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 96, steps: makeSteps.passport(), findings: ["Valid until 2027", "Name matches"], issues: [] } },
    ],
  },
  {
    id: "3",
    applicantNo: "121358",
    lastName: "Abbas",
    firstName: "Rabia",
    gender: "female",
    nationality: "Pakistan (Isl. Rep.)",
    email: "rabiaabbas535@gmail.com",
    address: "Flat 3B, DHA Phase 2, Lahore",
    phone: "+92321654321",
    requestStatus: "Received",
    semester: "Winter Semester 2027/28",
    programme: "Helmut-Schmidt-Programme (Social Protection)",
    documents: [
      { id: "d1", type: "Application Form", filename: "AppForm_Rabia.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 93, steps: makeSteps.applicationForm(), findings: ["Typed", "Complete", "Hand-signed"], issues: [] } },
      { id: "d2", type: "Checklist", filename: "Checklist_Rabia.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 91, steps: makeSteps.checklist(), findings: ["Signed, all boxes ticked"], issues: [] } },
      { id: "d3", type: "Letter of Motivation", filename: "Motivation_Rabia.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 86, steps: makeSteps.motivation(), findings: ["2 pages", "Date present", "Criteria addressed"], issues: [] } },
      { id: "d4", type: "CV", filename: "Europass_Rabia.pdf", confirmation: "Europass, hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 89, steps: makeSteps.cv(), findings: ["Europass format", "Hand-signed", "Date present", "No unexplained gaps"], issues: [] } },
      { id: "d5", type: "University Degree", filename: "Degree_Rabia.pdf", confirmation: "Signed and stamped.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 90, steps: makeSteps.degree(), findings: ["English — no translation needed", "Upper third grades", "Within 6-year limit", "Stamp and signature"], issues: [] } },
      { id: "d6", type: "Transcript", filename: "Transcript_Rabia.pdf", confirmation: "Full transcripts.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 88, steps: makeSteps.transcript(), findings: ["Full set", "Grading scale included", "English", "Stamp confirmed"], issues: [] } },
      { id: "d7", type: "Practical Experience", filename: "WorkCert_Rabia.pdf", confirmation: "Signed and stamped.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 85, steps: makeSteps.practicalExp(), findings: ["Headed paper", "Stamp and signature", "Relevant"], issues: [] } },
      { id: "d8", type: "Written Reference", filename: "Reference_Rabia.pdf", confirmation: "From current employer.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 87, steps: makeSteps.reference(), findings: ["Current employer", "Headed paper", "Original signature and stamp"], issues: [] } },
      { id: "d9", type: "English Language Proof", filename: "TOEFL_Rabia.pdf", confirmation: "TOEFL certificate.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 94, steps: makeSteps.language(), findings: ["TOEFL 98 — strong score", "Valid", "Name matches"], issues: [] } },
      { id: "d10", type: "Passport", filename: "Passport_Rabia.pdf", confirmation: "Valid passport.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 96, steps: makeSteps.passport(), findings: ["Valid passport confirmed"], issues: [] } },
    ],
  },
  {
    id: "4",
    applicantNo: "116630",
    lastName: "Abbasi",
    firstName: "Sindhu",
    gender: "female",
    nationality: "Pakistan (Isl. Rep.)",
    email: "sindhu.abbassi2011@gmail.com",
    address: "House 45, Block G, Gulshan-e-Iqbal, Karachi",
    phone: "+92333789012",
    requestStatus: "Received",
    semester: "Winter Semester 2027/28",
    programme: "Helmut-Schmidt-Programme (Social Protection)",
    documents: [
      { id: "d1", type: "Application Form", filename: "AppForm_Sindhu.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 91, steps: makeSteps.applicationForm(), findings: ["Typed", "Complete", "Hand-signed"], issues: [] } },
      { id: "d2", type: "Checklist", filename: "Checklist_Sindhu.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 89, steps: makeSteps.checklist(), findings: ["Signed"], issues: [] } },
      { id: "d3", type: "Letter of Motivation", filename: "Motivation_Sindhu.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 84, steps: makeSteps.motivation(), findings: ["2 pages", "Date present", "Hand-signed"], issues: [] } },
      {
        id: "d4", type: "CV", filename: "CV_Sindhu.pdf", confirmation: "CV provided.", status: "Invalid",
        aiAnalysis: {
          status: "Invalid", confidence: 85,
          steps: makeSteps.cv(["format", "gap", "nodate"]),
          findings: [],
          issues: ["CV is not in Europass format — custom template used", "Gap of 8 months (Mar 2023 – Nov 2023) not explained", "Date of issue missing"],
        },
      },
      {
        id: "d5", type: "University Degree", filename: "Degree_Sindhu.pdf", confirmation: "Signed and stamped.", status: "Invalid",
        aiAnalysis: {
          status: "Invalid", confidence: 82,
          steps: makeSteps.degree(["stamp", "translation"]),
          findings: [],
          issues: ["Stamp appears to be a photocopy, not an original", "Document in Urdu — certified translation into German or English required"],
        },
      },
      {
        id: "d6", type: "Transcript", filename: "Transcript_Sindhu.pdf", confirmation: "Transcripts provided.", status: "Invalid",
        aiAnalysis: {
          status: "Invalid", confidence: 79,
          steps: makeSteps.transcript(["incomplete", "grading", "translation"]),
          findings: [],
          issues: ["Academic years 2 and 3 missing — incomplete transcript", "No grading system explanation", "Urdu content without certified translation"],
        },
      },
      { id: "d7", type: "Practical Experience", filename: "Exp_Sindhu.pdf", confirmation: "On headed paper.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 83, steps: makeSteps.practicalExp(), findings: ["Headed paper", "Stamp and date", "Relevant experience"], issues: [] } },
      { id: "d8", type: "Written Reference", filename: "Ref_Sindhu.pdf", confirmation: "Employer reference.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 84, steps: makeSteps.reference(), findings: ["Current employer", "Headed paper", "Signature and stamp"], issues: [] } },
      { id: "d9", type: "English Language Proof", filename: "IELTS_Sindhu.pdf", confirmation: "IELTS attached.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 93, steps: makeSteps.language(), findings: ["IELTS 6.5 — meets minimum"], issues: [] } },
      { id: "d10", type: "Passport", filename: "Passport_Sindhu.pdf", confirmation: "Passport copy.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 95, steps: makeSteps.passport(), findings: ["Valid passport"], issues: [] } },
    ],
  },
  {
    id: "5",
    applicantNo: "121443",
    lastName: "Abdella",
    firstName: "Nadiya",
    gender: "female",
    nationality: "Ethiopia",
    email: "nadiyaabdella@yahoo.com",
    address: "Bole Sub-City, Woreda 3, Addis Ababa",
    phone: "+251912345678",
    requestStatus: "Received",
    semester: "Winter Semester 2027/28",
    programme: "Helmut-Schmidt-Programme (Social Protection)",
    documents: [
      { id: "d1", type: "Application Form", filename: "AppForm_Nadiya.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 92, steps: makeSteps.applicationForm(), findings: ["Typed", "All fields", "Signed"], issues: [] } },
      { id: "d2", type: "Checklist", filename: "Checklist_Nadiya.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 90, steps: makeSteps.checklist(), findings: ["Signed, all boxes ticked"], issues: [] } },
      { id: "d3", type: "Letter of Motivation", filename: "Motivation_Nadiya.pdf", confirmation: "Hand-signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 86, steps: makeSteps.motivation(), findings: ["2 pages", "Date", "All criteria addressed"], issues: [] } },
      { id: "d4", type: "CV", filename: "Europass_Nadiya.pdf", confirmation: "Europass CV.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 88, steps: makeSteps.cv(), findings: ["Europass format", "Hand-signed", "Date present", "No gaps"], issues: [] } },
      { id: "d5", type: "University Degree", filename: "Degree_Nadiya.pdf", confirmation: "Stamped and signed.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 88, steps: makeSteps.degree(), findings: ["English — no translation", "Upper third", "Within 6 years", "Stamp and signature"], issues: [] } },
      { id: "d6", type: "Transcript", filename: "Transcript_Nadiya.pdf", confirmation: "Full transcripts.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 86, steps: makeSteps.transcript(), findings: ["Full set", "GPA scale included", "Stamp confirmed"], issues: [] } },
      { id: "d7", type: "Practical Experience", filename: "WorkExp_Nadiya.pdf", confirmation: "Signed and stamped.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 85, steps: makeSteps.practicalExp(), findings: ["Headed paper", "Stamp and signature", "Date", "HSP-relevant"], issues: [] } },
      { id: "d8", type: "Written Reference", filename: "Reference_Nadiya.pdf", confirmation: "University lecturer reference.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 87, steps: makeSteps.reference(), findings: ["University lecturer", "Headed paper", "Code certified digital signature", "Stamp and date"], issues: [] } },
      { id: "d9", type: "English Language Proof", filename: "IELTS_Nadiya.pdf", confirmation: "IELTS certificate.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 95, steps: makeSteps.language(), findings: ["IELTS 7.5 — strong score", "Valid", "Name matches"], issues: [] } },
      { id: "d10", type: "Passport", filename: "Passport_Nadiya.pdf", confirmation: "Passport copy.", status: "Valid", aiAnalysis: { status: "Valid", confidence: 96, steps: makeSteps.passport(), findings: ["Valid passport", "Ethiopia — DAC eligible"], issues: [] } },
    ],
  },
];
