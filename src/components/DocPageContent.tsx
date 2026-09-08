import { type Document } from "../data/applicants";

export default function DocPageContent({ doc, page }: { doc: Document; page: number }) {
  if (doc.type === "Application Form") {
    if (page === 1)
      return (
        <div className="p-8 font-sans text-sm text-gray-800 max-w-2xl mx-auto">
          <h2 className="text-center text-[#003DA5] font-bold text-base mb-1">Application for a DAAD scholarship in the</h2>
          <h2 className="text-center text-[#003DA5] font-bold text-base mb-4">Helmut-Schmidt-Programme</h2>
          <p className="text-center text-xs text-gray-600 mb-6">Information about you and the master's programmes you would like to apply for</p>
          <table className="w-full border-collapse text-xs mb-6">
            {[
              ["Surname(s) as stated in your passport", "HASAN"],
              ["First name(s) as stated in your passport", "MD MORSHED"],
              ["E-mail address", "morshedhasan.bu@gmail.com"],
              ["Date and place of birth", "22/12/1998, BARISHAL"],
              ["Country of permanent residence", "Bangladesh"],
              ["Nationality", "Bangladeshi"],
              ["Sex", "Male"],
              ["Current professional occupation", "Project Associate"],
              ["Name of current employer / university", "BRAC"],
              ["What professional career do you envisage", "Policy and Programme Manager in the development sector, specializing in nonprofit management and public policy"],
            ].map(([label, value]) => (
              <tr key={label} className="border border-gray-300">
                <td className="p-2 bg-gray-50 font-medium w-1/2 text-gray-600">{label}</td>
                <td className="p-2">{value}</td>
              </tr>
            ))}
          </table>
          <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">Page 1 of 2</div>
        </div>
      );
    return (
      <div className="p-8 font-sans text-sm text-gray-800 max-w-2xl mx-auto">
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Hereby, I agree that the DAAD and the chosen higher education institutions are allowed to process my above-stated personal data in the context of the selection process for a scholarship in the Helmut-Schmidt-Programme.
        </p>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          I confirm that all information provided in my application is correct, up-to-date and complete. I will inform the DAAD of any changes in my circumstances immediately.
        </p>
        <p className="text-xs text-gray-600 mb-8 leading-relaxed">
          I am aware that false statements in the application can lead to the annulment of the application or the revocation of a scholarship that has already been awarded.
        </p>
        <div className="mt-8 italic text-lg font-serif text-gray-700">Morshed Hasan</div>
        <div className="border-t border-gray-400 mt-1 pt-1 text-xs text-gray-500 flex gap-8">
          <span>24/01/2026, Barishal</span>
          <span className="text-gray-400">Date and place</span>
        </div>
        <div className="mt-8 text-xs text-gray-500">Current professional occupation: Project Associate</div>
        <div className="text-xs text-gray-600 mt-1">What professional career do you envisage: Policy and Programme Manager in the development sector, specializing in nonprofit management and public policy</div>
        <div className="text-xs text-gray-500 border-t border-gray-200 pt-3 mt-6">Page 2 of 2</div>
      </div>
    );
  }

  if (doc.type === "Checklist")
    return (
      <div className="p-8 text-xs text-gray-800 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#003DA5] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">DAAD</div>
          <div>
            <div className="font-bold text-[#003DA5] text-sm">DAAD Application Checklist</div>
            <div className="text-gray-400 text-xs">ST42 Helmut-Schmidt-Programm – Stipendienausschreibung 04/2026</div>
          </div>
        </div>
        <div className="text-xs font-semibold text-gray-700 mb-3">Checklist: mandatory documents (please tick off)</div>
        {[
          ["DAAD Application Form (typed answers)", "mandatory"],
          ["Letter of Motivation (max. 2 pages, incl. date)", "mandatory"],
          ["CV — Europass format, incl. date of issue", "mandatory"],
          ["University Degree / Certificates", "mandatory"],
          ["Certified translation if not in German or English", "mandatory if applicable"],
          ["Transcript — full set", "mandatory"],
          ["Grading system explanation (if not in transcript)", "mandatory if applicable"],
          ["Practical experience proof — headed paper, original signature, date, stamp", "mandatory if to be considered"],
          ["Current written reference — headed paper, original signature, date, stamp", "mandatory"],
          ["Proof of English language skills", "mandatory"],
        ].map(([item, req]) => (
          <div key={item} className="flex items-start gap-3 py-2 border-b border-gray-100">
            <div className="w-4 h-4 border-2 border-[#003DA5] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#003DA5] text-[10px] font-bold">✓</span>
            </div>
            <span className="flex-1 leading-relaxed">{item}</span>
            <span className="text-gray-400 text-[10px] text-right whitespace-nowrap">{req}</span>
          </div>
        ))}
        <div className="mt-6">
          <div className="text-xs text-gray-500 mb-1">Name of applicant:</div>
          <div className="italic font-serif text-gray-700">Morshed Hasan</div>
          <div className="border-t border-gray-400 mt-1 pt-1 text-[10px] text-gray-500">24/01/2026, Barishal — name in capital letters and signature by hand</div>
        </div>
      </div>
    );

  if (doc.type === "Letter of Motivation")
    return (
      <div className="p-8 text-xs text-gray-800 max-w-2xl mx-auto leading-relaxed">
        <div className="text-right text-gray-500 mb-4">Barishal, 24 January 2026</div>
        <div className="font-bold mb-1">Letter of Motivation</div>
        <div className="text-gray-500 mb-4">Application for the DAAD Helmut-Schmidt-Programme — Master's in Social Protection Policy</div>
        <p className="mb-3">Dear Members of the Selection Committee,</p>
        <p className="mb-3">I am writing to apply for the DAAD Helmut-Schmidt-Programme scholarship to pursue a Master's in Social Policy and Social Security Studies at Hochschule Bonn-Rhein-Sieg. With a background in development programme management and a strong commitment to strengthening social protection systems in the Global South, I believe this programme aligns precisely with my professional goals and the programme's objectives.</p>
        <p className="mb-3">Professionally, I currently work as a Project Associate at BRAC, where I manage social protection programmes targeting ultra-poor households across rural Bangladesh. This role has deepened my conviction that evidence-based policy design is critical to sustainable development outcomes. I have also engaged in voluntary work with two NGOs focused on community health education.</p>
        <p className="mb-3">Academically, I graduated with a Bachelor of Business Administration (Honours) from the University of Barishal with a CGPA of 3.45/4.00, placing me in the upper third of my cohort. This programme will allow me to bridge my practical field experience with advanced academic knowledge in social policy analysis.</p>
        <p className="mb-4">I am deeply motivated by the Helmut-Schmidt-Programme's goal of training future leaders who contribute to social development. I look forward to bringing my experience back to Bangladesh and contributing to its evolving social protection architecture.</p>
        <div className="mt-8 italic font-serif text-gray-700">Morshed Hasan</div>
        <div className="border-t border-gray-400 mt-1 pt-1 text-[10px] text-gray-500">24/01/2026, Barishal</div>
        <div className="text-[10px] text-gray-400 mt-4">Page 1 of 2 · Maximum 2 pages</div>
      </div>
    );

  if (doc.type === "CV")
    return (
      <div className="p-8 text-xs text-gray-800 max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-[#003DA5]">Curriculum Vitae</div>
          <div className="text-xs text-gray-500">Europass Format · Date of issue: January 2026</div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="col-span-1 bg-[#003DA5] text-white p-3 text-[10px] space-y-2">
            <div><div className="font-bold">PERSONAL INFO</div></div>
            <div>Md Morshed Hasan</div>
            <div>22/12/1998, Barishal</div>
            <div>morshedhasan.bu@gmail.com</div>
            <div>+8801700898470</div>
            <div className="mt-3 font-bold">NATIONALITY</div>
            <div>Bangladeshi</div>
          </div>
          <div className="col-span-2 space-y-3">
            <div>
              <div className="font-bold text-[#003DA5] border-b border-[#003DA5] pb-0.5 mb-1.5">WORK EXPERIENCE</div>
              <div className="font-semibold">Jan 2024 – Present · Project Associate, BRAC</div>
              <div className="text-gray-600">Social protection programme management, rural Bangladesh</div>
              <div className="font-semibold mt-1.5">May 2023 – Dec 2023 · Programme Intern, UN Women Bangladesh</div>
              <div className="text-gray-600">Gender-responsive budgeting research support</div>
              <div className="font-semibold mt-1.5">Jan 2023 – Apr 2023 · Research Assistant, University of Barishal</div>
              <div className="text-gray-600">Development economics data analysis</div>
            </div>
            <div>
              <div className="font-bold text-[#003DA5] border-b border-[#003DA5] pb-0.5 mb-1.5">EDUCATION</div>
              <div className="font-semibold">2019–2023 · BBA (Honours), University of Barishal</div>
              <div className="text-gray-600">CGPA: 3.45/4.00 — Upper third of cohort</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 text-[10px] text-gray-400">Europass CV · Md Morshed Hasan · Date of issue: January 2026 — hand-signed original submitted</div>
      </div>
    );

  if (doc.type === "University Degree")
    return (
      <div className="p-8 text-center text-gray-800 max-w-2xl mx-auto">
        <div className="border-4 border-[#003DA5] p-8">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">University of Barishal</div>
          <div className="text-[#003DA5] font-serif text-xl font-bold mb-4">Certificate of Graduation</div>
          <p className="text-sm leading-relaxed mb-4">This is to certify that <strong>Md Morshed Hasan</strong> has successfully completed all requirements for the degree of</p>
          <div className="text-lg font-bold font-serif text-[#003DA5] mb-4">Bachelor of Business Administration (Honours)</div>
          <p className="text-xs text-gray-500 mb-2">Awarded: June 2023 · CGPA: 3.45/4.00</p>
          <p className="text-xs text-gray-500 mb-6">Result: First Class — Upper Third of Cohort</p>
          <div className="flex justify-between text-xs mt-8 gap-8">
            <div className="text-center flex-1 border-t border-gray-400 pt-1">Vice-Chancellor<br/>Prof. Dr. A. Rahman</div>
            <div className="text-center flex-1 border-t border-gray-400 pt-1">Registrar<br/>University of Barishal</div>
          </div>
          <div className="mt-4 text-[10px] text-gray-400">Official Seal · University of Barishal · Established 2001</div>
        </div>
      </div>
    );

  if (doc.type === "Transcript")
    return (
      <div className="p-8 text-xs text-gray-800 max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <div className="font-bold text-sm">University of Barishal — Official Academic Transcript</div>
          <div className="text-gray-500">Student: Md Morshed Hasan · ID: UB-2019-BBA-0456 · Programme: BBA (Honours)</div>
        </div>
        {[["Year 1 (2019–2020)", [["Principles of Economics","3","A"],["Business Mathematics","3","A-"],["Financial Accounting","3","B+"]]], ["Year 2 (2020–2021)", [["Microeconomics","3","A"],["Organizational Behaviour","3","A-"],["Statistics for Business","3","A"]]], ["Year 3 (2021–2022)", [["Development Economics","3","A"],["Public Policy & Governance","3","A"],["Research Methods","3","A-"]]], ["Year 4 (2022–2023)", [["Social Protection Policy","3","A"],["Thesis: Social Safety Nets","6","A"],["Internship","3","A-"]]]].map(([year, courses]) => (
          <div key={year as string} className="mb-3">
            <div className="font-semibold text-[#003DA5] mb-1">{year as string}</div>
            <table className="w-full border-collapse">
              {(courses as string[][]).map(([c, cr, g]) => (
                <tr key={c} className="border-b border-gray-100">
                  <td className="p-1.5">{c}</td>
                  <td className="p-1.5 text-center text-gray-500 w-12">{cr} cr</td>
                  <td className="p-1.5 text-center font-semibold w-10">{g}</td>
                </tr>
              ))}
            </table>
          </div>
        ))}
        <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
          <span>Cumulative GPA</span><span>3.45 / 4.00</span>
        </div>
        <div className="text-[10px] text-gray-500 mt-2">Grading Scale: A=4.0, A-=3.7, B+=3.3, B=3.0 · Registrar stamp and signature present</div>
      </div>
    );

  if (doc.type === "Passport")
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-[#1a3a6b] text-white p-6 rounded-lg max-w-sm mx-auto">
          <div className="text-center text-xs mb-4 uppercase tracking-widest">People's Republic of Bangladesh</div>
          <div className="text-center text-lg font-bold mb-4">PASSPORT</div>
          <div className="bg-white/10 rounded p-4 text-xs grid grid-cols-2 gap-3">
            {[["Surname","HASAN"],["Given Names","MD MORSHED"],["Nationality","BANGLADESHI"],["Date of Birth","22 DEC 1998"],["Sex","M"],["Place of Birth","BARISHAL"],["Date of Issue","10 MAR 2022"],["Date of Expiry","09 MAR 2032"],["Passport No.","A12345678"]].map(([k,v]) => (
              <div key={k}><div className="text-blue-300 text-[9px]">{k}</div><div className="font-bold text-sm">{v}</div></div>
            ))}
          </div>
          <div className="mt-4 font-mono text-[9px] text-center text-blue-200 leading-tight">P&lt;BGDHASAN&lt;&lt;MD&lt;MORSHED&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>A123456782BGD9812225M3203099&lt;&lt;&lt;&lt;&lt;&lt;&lt;6</div>
        </div>
      </div>
    );

  if (doc.type === "Letter of Motivation" || doc.type === "Practical Experience" || doc.type === "Voluntary Certificate")
    return (
      <div className="p-8 text-xs text-gray-800 max-w-2xl mx-auto leading-relaxed">
        <div className="text-right text-gray-500 mb-4">Dhaka, January 2026</div>
        <div className="font-bold text-sm mb-4">{doc.type}</div>
        <p className="mb-3">To Whom It May Concern,</p>
        <p className="mb-3">This is to confirm that <strong>Md Morshed Hasan</strong> has been employed at our organisation in a professional capacity, demonstrating excellent commitment and performance. We fully support his application for the DAAD Helmut-Schmidt-Programme scholarship.</p>
        <p className="mb-6">His work has been exemplary and we recommend him without reservation for the scholarship programme.</p>
        <div className="border-t border-gray-200 pt-4">
          <div className="font-semibold">Dr. Karim Uddin</div>
          <div className="text-gray-500">Programme Director · BRAC</div>
          <div className="mt-4 text-[10px] text-gray-400">On official BRAC headed paper · Original digital signature · Date: 15/01/2026 · BRAC organisational stamp</div>
        </div>
      </div>
    );

  if (doc.type === "Written Reference")
    return (
      <div className="p-8 text-xs text-gray-800 max-w-2xl mx-auto leading-relaxed">
        <div className="border-b-2 border-[#003DA5] pb-3 mb-5">
          <div className="font-bold text-sm text-[#003DA5]">BRAC</div>
          <div className="text-gray-400 text-[10px]">75 Mohakhali, Dhaka 1212, Bangladesh · www.brac.net</div>
        </div>
        <div className="text-right text-gray-500 mb-4">Dhaka, 15 January 2026</div>
        <div className="font-bold mb-3">Reference Letter — Md Morshed Hasan</div>
        <p className="mb-3">To the DAAD Selection Committee,</p>
        <p className="mb-3">I am pleased to provide this reference for <strong>Md Morshed Hasan</strong>, who has served as a Project Associate at BRAC since January 2024 under my direct supervision. In this role, he has demonstrated exceptional analytical capability, cross-functional collaboration, and commitment to social protection outcomes.</p>
        <p className="mb-3">He consistently delivers high-quality programme reports and has independently managed relationships with government counterparts. I recommend him unreservedly for the DAAD Helmut-Schmidt-Programme scholarship.</p>
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="font-semibold">Dr. Karim Uddin</div>
          <div className="text-gray-500">Programme Director, Social Protection · BRAC</div>
          <div className="mt-2 text-[10px] text-gray-400">Headed paper · Code-certified digital signature · BRAC stamp · Date: 15/01/2026</div>
        </div>
      </div>
    );

  if (doc.type === "English Language Proof")
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="border-2 border-gray-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xs">IELTS</div>
            <div>
              <div className="font-bold text-sm">IELTS Test Report Form</div>
              <div className="text-xs text-gray-500">International English Language Testing System</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs mb-4">
            {[["Candidate Name","MD MORSHED HASAN"],["Date of Birth","22 December 1998"],["Test Date","15 March 2025"],["Centre Number","BD012-Dhaka"],["Candidate Number","0012345"],["Test Type","Academic"],["Nationality","Bangladeshi"],["First Language","Bengali"]].map(([k,v]) => (
              <div key={k}><span className="text-gray-500">{k}: </span><span className="font-medium">{v}</span></div>
            ))}
          </div>
          <div className="bg-gray-50 rounded p-4 mb-4">
            <div className="text-xs font-semibold text-gray-700 mb-2">Test Results</div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {[["Overall","7.0"],["Listening","7.5"],["Reading","7.0"],["Writing","6.5"],["Speaking","7.0"]].map(([skill,score]) => (
                <div key={skill} className={`rounded p-2 ${skill === "Overall" ? "bg-[#003DA5] text-white" : "bg-white border border-gray-200"}`}>
                  <div className="text-xs">{skill}</div>
                  <div className="text-lg font-bold">{score}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-gray-500">Valid until: 14 March 2027 · Official IELTS Test Report Form — not a copy</div>
        </div>
      </div>
    );

  return (
    <div className="p-8 flex items-center justify-center min-h-[300px]">
      <div className="text-center text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div className="font-medium text-gray-500 text-sm">{doc.filename}</div>
        <div className="text-xs mt-1">{doc.type}</div>
      </div>
    </div>
  );
}
