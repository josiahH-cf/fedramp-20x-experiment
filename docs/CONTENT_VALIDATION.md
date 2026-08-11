# FedRAMP 20x content validation record

**Verified:** 2026-08-11

**Application:** FedRAMP 20x Operations Park

**Supplied rule version:** FedRAMP Consolidated Rules for 2026, `2026.07.14.01` (embedded update `2026-07-14`)

## Scope and method

The product preserves both supplied source files unchanged:

- `fedramp-20x-field-guide.html` is the original field-guide presentation and embedded structured data source.
- `fedramp-20x-deterministic-requirements-processes summarized.md` is the deterministic rule, sequence, applicability, timing, and source-gap specification.

`scripts/extract-source-data.mjs` deterministically extracts the original HTML `DATA` object into `src/data/source-data.json`. The generated model contains:

- 17 rulesets declaring 225 total rules;
- 60 explicit rule statements embedded by the source;
- 46 KSI indicators across 10 families;
- 75 defined terms; and
- eight JSON-schema summaries.

`scripts/validate-content.mjs` reparses the original on every build and fails if the generated model differs. It also validates scene order, scene connections, source IDs, remediation values, incident-clock values, correction coverage, and authoritative source domains.

The review compared the supplied claims with current first-party sources from FedRAMP/GSA, CISA, OMB, NIST, the White House, and the Office of the Law Revision Counsel. No vendor marketing, unofficial article, or unsourced summary was used to establish a fact.

## Deterministic rule application

The guided scene order implements the supplied top-level operating process:

1. orient to provider, assessor, FedRAMP, and agency responsibilities;
2. select Type × Path × Class and resolve applicability;
3. build the implementation → measure/cycle → verification → validation → independent-assessment evidence loop;
4. demonstrate KSI outcomes;
5. detect vulnerabilities and process failures persistently;
6. evaluate reachability, exploitability, and PAIN;
7. select and operate the response clock, including KEV override and vulnerability states;
8. report active and accepted vulnerability activity through human and JSON channels;
9. qualify and communicate incidents in parallel;
10. classify and notify significant changes;
11. supply ongoing certification reports, reviews, feedback, and trust-center access; and
12. reconnect those activities into the persistent operating loop.

MUST, SHOULD, MAY, MUST NOT, and SHOULD NOT retain their supplied force. The application does not elevate a recommendation into a requirement or weaken a requirement into an option.

## Material corrections and qualifications

### 1. Certification class is not an overall security score

The supplied narrative describes assurance increasing from Class A through Class D. Current official FedRAMP guidance explains that classes vary the amount of information shared and the commitments for maintenance, assessment, and reporting; they do **not** determine how secure a provider or offering is. The application uses “increasing commitments” and explicitly warns against treating class as a security grade.

### 2. FedRAMP 20x Class D is future

The supplied timing matrices contain Class D values and its applicability model presents Class D as a selectable profile. Current FedRAMP guidance says 20x initially supports Classes A–C and that Class D is future Phase 4 work. The application:

- presents A–C as the current 20x class surface;
- labels Class D as future/not currently available; and
- retains supplied Class D matrix values only as planning context so deterministic source data is not silently discarded.

As of the verification date, the Class A pipeline opened August 3, 2026; Class B and C pipelines are scheduled to open August 31, 2026.

### 3. Five KSI outcome statements were absent from the extraction

The supplied HTML contains IDs, names, and Rev5 mappings but blank outcome strings for five KSIs. Current official Consolidated Rules pages publish the outcomes. The application restores and visibly marks:

- `KSI-CNA-EIS` — Enforcing Intended State;
- `KSI-MLA-ALA` — Authorizing Log Access;
- `KSI-SVC-PRR` — Preventing Residual Risk;
- `KSI-SVC-RUD` — Removing Unwanted Data; and
- `KSI-SVC-VCM` — Validating Communications.

These corrections appear only in the product's validated learning model; the original files remain untouched.

### 4. VDR cadence gaps

The source cadence object omits all `VDR-TFR-NMV` cells and its own explanatory text supplies “MUST every three months.” Current official FedRAMP VDR pages also publish the three-month non-machine verification/validation requirement. The application displays that value with its MUST force.

The source has no `VDR-TFR-MVX` Class D value. Because 20x Class D is not currently available, the application leaves that cell as “Future / not set” rather than inventing a number.

### 5. Partial embedded rule coverage

The original declares 225 rules but embeds full statements for only 60. The application identifies this distinction in the Library. It does not synthesize the remaining 165 statements from rule counts or titles. Users are directed to current official Consolidated Rules pages for complete live requirements.

### 6. Applicability and renderer differences retained

The supplied VDR, VER, and IEC metadata lists Classes B–D while its renderer and matrices also include Class A. The application retains Class A matrix values and labels their source context. The supplied `FRC-CCL` metadata is narrower than its rendered class-change explanation; the simulation retains the explicit “new certification for class change” rule and does not expand it beyond the supplied presentation.

## Authoritative source list

- [FedRAMP 20x program overview](https://www.fedramp.gov/20x/)
- [FedRAMP Consolidated Rules for 2026 timeline](https://www.fedramp.gov/2026/timeline/)
- [FedRAMP Certification rules](https://www.fedramp.gov/2026/providers/20x/rules/fedramp-certification/)
- [FedRAMP Key Security Indicators](https://www.fedramp.gov/2026/reference/20x/c/key-security-indicators/)
- [FedRAMP Vulnerability Detection and Response](https://www.fedramp.gov/2026/providers/20x/rules/vulnerability-detection-and-response/)
- [FedRAMP Vulnerability Evaluation and Reporting](https://www.fedramp.gov/2026/providers/20x/rules/vulnerability-evaluation-and-reporting/)
- [FedRAMP Incident Evaluation and Communication](https://www.fedramp.gov/2026/providers/20x/rules/incident-evaluation-and-communication/)
- [FedRAMP Significant Change Notification](https://www.fedramp.gov/2026/providers/20x/rules/significant-change-notification/)
- [FedRAMP Certification Data Sharing](https://www.fedramp.gov/2026/providers/20x/rules/certification-data-sharing/)
- [FedRAMP Security Decision Record](https://www.fedramp.gov/2026/providers/20x/rules/security-decision-record/)
- [FedRAMP response to CISA BOD 26-04](https://www.fedramp.gov/notices/0014/)
- [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [OMB M-24-15](https://www.whitehouse.gov/wp-content/uploads/2024/07/M-24-15-Modernizing-the-Federal-Risk-and-Authorization-Management-Program.pdf)
- [NIST SP 800-37 Rev. 2](https://csrc.nist.gov/pubs/sp/800/37/r2/final)
- [44 U.S.C. § 3607](https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title44-section3607)

## Remaining limitations

- This is an educational aid, not official FedRAMP guidance, legal advice, an assessment result, or an agency authorization decision.
- The application cannot complete rule statements absent from the supplied source. The current official Consolidated Rules remain controlling.
- Business-day calculations are displayed as requirements but the simulation does not implement a jurisdiction-specific holiday calendar.
- Class D values are shown only where the source supplies them and are not represented as a currently obtainable 20x profile.
