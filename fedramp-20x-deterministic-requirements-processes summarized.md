# FedRAMP 20x Deterministic Requirements and Processes

**Source:** `fedramp-20x-field-guide(1).html`  
**Embedded rules title:** FedRAMP Consolidated Rules for 2026  
**Embedded version:** 2026.07.14.01  
**Embedded update date:** 2026-07-14

This document uses only the supplied HTML page. It converts the page’s explicit rule statements, outcome statements, timing matrices, report fields, schema requirements, applicability metadata, and explanatory process text into a deterministic checklist and operating sequence.

The page identifies 17 rulesets, but it does not embed the full text of every rule in every ruleset. This document includes every explicit rule statement available in the page data and marks referenced-but-missing lists, blank outcome statements, and absent matrix values as **Not specified in source**. It does not fill those gaps from outside material.

**Coverage represented in this extraction:**

- 17 rulesets with 225 total rules declared by the page metadata.
- 60 explicit rule statements embedded in the guide’s focused rule arrays and reproduced here.
- 46 KSI indicators across 10 families.
- 8 JSON schemas and 75 defined terms represented by the page.

## 1. Normative Interpretation

| Force word | Deterministic interpretation stated by the page |
|---|---|
| **MUST** | Hard requirement. Absence is a finding. |
| **SHOULD** | Strongly expected. Not doing it requires a documented, accepted reason and the resulting risk. |
| **MAY** | Optional allowance, not an expectation. |
| **MUST NOT** | Hard prohibition. |
| **SHOULD NOT** | Prohibition; the mirror image of SHOULD. |

For operational use, retain the force word attached to each rule. Do not silently convert **SHOULD** to **MAY**, or **MAY** to **MUST**.

### 1.1 Timing and Evidence Terms That Control Execution

- **Persistently (`FRD-PER`):** Occurring in a firm, steady way that is repeated over a long period of time in spite of obstacles or difficulties. Persistent activities may vary between actors, may occur irregularly, and may include interruptions or waiting periods between cycles. These attributes of persistent activities should be intentional, understood, and documented; the status of persistent activities will always be known.
  - **Note:** The use of persistently indicates a process that may not always occur continuously (without interruption or gaps) or regularly (on a consistent, predictable basis) but will repeat frequently in cycles. It aligns generally with historical misuse of "continuous" in federal information security policies.
- **Promptly (`FRD-PRO`):** Without unnecessary delay.
  - **Note:** The use of promptly in FedRAMP materials frames conveys a need for urgent action where the expected time frame will vary by circumstance but earlier action is more likely to improve security outcomes and increase the security posture of a cloud service offering.
- **Regularly (`FRD-RGL`):** Performing the activity on a consistent, predictable, and repeated basis, at set intervals, automatically if possible, following a documented plan. These intervals may vary as appropriate between different activities.
- **Deterministic Telemetry (`FRD-DTM`):** Verifiable data collected directly from an authoritative source that represents a factual and reproducible observation of the attributes of a system such as the system's state, configuration, or behavior.
  - **Note:** Probabilistic inferences, generative outputs, or predictive assessments such as those produced using generative transformer models (commonly referred to as “Generative AI”) do not constitute a factual record of the system state and must not be used to generate deterministic telemetry.
- **Machine-Generated (`FRD-MGN`):** Automatically produced by a computer process, application, or other mechanism without the intervention or manipulation of a human during production.
- **Machine-Readable (`FRD-MRD`):** Has the meaning from 44 U.S. Code § 3502 (18) which is "the term "machine-readable", when used with respect to data, means data in a format that can be easily processed by a computer without human intervention while ensuring no semantic meaning is lost"
- **Verification (`FRD-VRF`):** Confirmation through objective evidence that specified FedRAMP Practices have been fulfilled for a cloud service offering.
  - **Note:** This adapts the ISO conformity assessment concept of verification to the FedRAMP Certification context.
- **Validation (`FRD-VLN`):** Confirmation through objective evidence that implemented security capabilities and related certification data are suitable for their intended FedRAMP Certification use and support the expected security outcomes for a cloud service offering.
  - **Note:** This adapts the ISO conformity assessment concept of validation to the FedRAMP Certification context.
- **Responsibly (`FRD-RSP`):** In a way that shows that you have good judgment and the ability to act correctly and make decisions on your own.
  - **Note:** Refrain from broadcasting any details that might assist adversaries in their endeavors, disclosing vulnerabilities prior to full remediation, or providing overly specific technical information that could potentially facilitate further compromise.
- **Likely (`FRD-LKY`):** A reasonable degree of probability based on context.

## 2. Applicability Model

A FedRAMP Certification Profile is the combination of:

1. **Certification Type:** Rev5 or 20x.
2. **Certification Path:** Program or Agency.
3. **Certification Class:** A, B, C, or D.

The page states that the 20x path is the **Program** path and that the **Agency** path is a legacy path available only for Rev5. Certification classes rise from minimal assurance at Class A to significant assurance at Class D.

### 2.1 Ruleset Registry

| ID | Ruleset | Status | Rule count | Effective information | Purpose |
|---|---|---:|---:|---|---|
| `AFC` | Addressing FedRAMP Communication | stable | 16 | required; Consolidated Rules for 2026; obtain/required: 2026-01-05 | The Addressing FedRAMP Communication rules (formerly FedRAMP Security Inbox) ensure FedRAMP can reliably contact the security and compliance staff responsible for every FedRAMP-authorized cloud service offering. These rules also set expectations for urgent communications, response time testing, and routing important messages separately from general support or customer service channels. |
| `AGU` | Agency Use of FedRAMP Certified Cloud Services | placeholder | 20 | required; Consolidated Rules for 2026; obtain/required: 2026-07-04; optional adoption: 2026-07-04 | The Agency Use rules summarize the many demands made on agencies by the FedRAMP Authorization Act and OMB Memorandum M-24-15 in a simple, clear, easy-to-follow set of FedRAMP-style rules. These rules align agency policies, authorization letters, machine-readable tools, secure configuration review, continuous monitoring, and communication with FedRAMP so certifications can be reused consistently across government. |
| `CCM` | Collaborative Continuous Monitoring | stable | 19 | Not specified in source | The Collaborative Continuous Monitoring rules help agencies use shared, current authorization information from providers as part of each agency's own Information Security Continuous Monitoring strategy. These rules reduce unnecessary manual burden by encouraging automated monitoring and review while allowing each agency to make its own risk-based decisions about ongoing authorization. |
| `CDS` | Certification Data Sharing | stable | 20 | Not specified in source | The Certification Data Sharing rules allow providers to store and share FedRAMP Certification Data through the platform they choose as long as it follows FedRAMP rules for access, accuracy, and transparency. This helps customers and the public review consistent, current security and compliance information while recognizing that the information usually remains the provider's intellectual property and is not federal information. |
| `CMU` | Cryptographic Module Use | stable | 3 | Not specified in source | The Cryptographic Module Use rules clarify how providers should select and use cryptographic modules. These rules allow risk-based decisions for some services while still encouraging validated cryptographic modules whenever they are technically feasible and reasonable. |
| `CPO` | Certification Package Overview | stable | 3 | Not specified in source | The Certification Package Overview rules outline the expectations for a simple overview of the cloud service offering that must be included within a FedRAMP Certification Package. This overview replaces the historically required base System Security Plan for FedRAMP Rev5 and is intended to provide a clear, concise, and consistent summary of the offering and the information included in the package to help customers understand the offering at a high level. |
| `FRC` | FedRAMP Certification | stable | 21 | Not specified in source | This ruleset explains how cloud service offerings obtain and maintain FedRAMP Certification across certification classes and paths. |
| `IEC` | Incident Evaluation and Communication | stable | 8 | Not specified in source | The Incident Evaluation and Communication rules explain how providers must communicate incident information to FedRAMP and government customers when they are affected by an incident or likely to be affected by an incident. |
| `IVV` | Independent Verification and Validation | stable | 15 | Not specified in source | This ruleset explains the expectations for independent verification and validation assessments. |
| `MAS` | Minimum Assessment Scope | stable | 5 | Not specified in source | The Minimum Assessment Scope rules help providers define assessment boundaries narrowly enough to avoid unnecessary review of components that do not affect the offering's security. These rules still ensure the assessment includes the resources and connections needed to understand the offering's confidentiality, integrity, and availability. |
| `MKT` | Marketplace Listing | stable | 12 | required; Consolidated Rules for 2026; obtain/required: 2026-07-04; optional adoption: 2026-07-04 | The Marketplace Listing rules define how FedRAMP decides which cloud service offerings, assessors, and advisors may be listed in the FedRAMP Marketplace. These rules help agencies and other customers rely on the Marketplace as a consistent source of eligible services and supporting organizations, while requiring listed organizations to supply accurate, accessible, and machine-readable information. |
| `REC` | FedRAMP Recognition of Independent Assessment Services | stable | 16 | required; Consolidated Rules for 2026; obtain/required: 2026-07-04; optional adoption: 2026-07-04 | The FedRAMP Recognition of independent assessment services rules explain the requirements for assessors to obtain and maintain FedRAMP Recognition in order to support the FedRAMP Certification process. |
| `SCG` | Secure Configuration Guide | stable | 9 | required; Consolidated Rules for 2026; obtain/required: 2026-03-01 | The Secure Configuration Guide rules help agencies and other customers understand how to configure a cloud service offering securely. These rules require providers to clearly explain the security impact of common settings so customers can make informed configuration choices. |
| `SCN` | Significant Change Notification | stable | 17 | Not specified in source | The Significant Change Notification rules supply a simple framework allowing providers to make significant changes to their own products while keeping agency customers in the loop. These rules organize significant changes into clear categories so agencies can understand the expected risk and make authorization decisions accordingly. |
| `SDR` | Security Decision Record | stable | 2 | Not specified in source | The Security Decision Record replaced a traditional System Security Plan with a persistently maintained, verified, and validated record of the security decisions made by the cloud service provider over the lifecycle of their cloud service offering. |
| `VDR` | Vulnerability Detection and Response | stable | 16 | required; Mandated by CISA BOD 26-04; obtain/required: 2026-12-07; optional adoption: 2026-07-04 | The Vulnerability Detection and Response rules require providers to continuously identify, analyze, prioritize, mitigate, and remediate vulnerabilities and related exposures through automated systems. These rules give providers flexibility in implementation while ensuring agencies receive the information needed to support ongoing authorization decisions. |
| `VER` | Vulnerability Evaluation and Reporting | stable | 23 | required; Mandated by CISA BOD 26-04; obtain/required: 2026-12-07; optional adoption: 2026-07-04 | The Vulnerability Evaluation and Reporting rules require cloud service providers to determine when vulnerabilities are likely to impact federal customers and report the status of such vulnerabilities to all necessary parties. |

### 2.2 Ruleset Subset Applicability

#### `AFC` — Addressing FedRAMP Communication

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `AFC-FRP` — FedRAMP Responsibilities | These rules apply to FedRAMP when communicating with cloud service providers. | FedRAMP | 20x, Rev5 | Program, Agency | B, C, D |
| `AFC-CSO` — General Provider Responsibilities | These rules apply to providers with any type of FedRAMP Certification. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `AGU` — Agency Use of FedRAMP Certified Cloud Services

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `AGU-AGC` — General Agency Responsibilities | These rules apply to agencies based on the FedRAMP Authorization Act, OMB M-24-15, and related FedRAMP policies. | Agencies | 20x, Rev5 | Program, Agency | A, B, C, D |
| `AGU-USE` — Use of FedRAMP Certifications | These rules apply when agencies use FedRAMP Certifications to make agency authorization decisions. | Agencies | 20x, Rev5 | Program, Agency | A, B, C, D |
| `AGU-SPN` — Agency Sponsored Certifications | These rules apply when an agency sponsors a FedRAMP Rev5 Certification after completing an agency authorization. | Agencies | Rev5 | Agency | B, C, D |

#### `CCM` — Collaborative Continuous Monitoring

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `CCM-AGM` — Agency Guidance | These rules for agencies apply to all agencies using a FedRAMP Certification. | Agencies | 20x, Rev5 | Program, Agency | B, C, D |
| `CCM-OCR` — Ongoing Certification Reports | These rules for Ongoing Certification Reports apply to providers with any type of FedRAMP Certification. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `CCM-QTR` — Quarterly Reviews | These rules for Quarterly Reviews apply to providers with any type of FedRAMP Certification. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `CDS` — Certification Data Sharing

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `CDS-CSO` — General Provider Responsibilities | These rules apply to providers for FedRAMP Certifications of any type. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `CDS-TRC` — FedRAMP-Compatible Trust Centers | These rules apply to trust centers that are FedRAMP-compatible. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `CDS-UTC` — Using a Trust Center | These rules apply to providers that are using a FedRAMP-compatible trust center instead of USDA Connect; they DO NOT apply to providers using USDA Connect. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `CMU` — Cryptographic Module Use

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `CMU-CSO` — Cloud Service Provider Responsibilities | These rules apply to providers for FedRAMP Certifications. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `CPO` — Certification Package Overview

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `CPO-CSO` — General Provider Responsibilities | These rules apply to providers for FedRAMP Certifications of any type. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `FRC` — FedRAMP Certification

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `FRC-CSO` — General Provider Responsibilities | These rules apply to cloud service providers obtaining and maintaining any FedRAMP Certification. | Providers | 20x, Rev5 | Program, Agency | A, B, C, D |
| `FRC-CLA` — FedRAMP Class A Certification Rules | These are specific rules that apply to providers seeking FedRAMP Class A Certifications. | Providers | 20x | Program | A |
| `FRC-APP` — Applying for FedRAMP Certification | These rules apply to cloud service providers who have met all other relevant rules and are ready to apply for any FedRAMP Certification. | Providers | 20x, Rev5 | Program, Agency | A, B, C, D |
| `FRC-APS` — Applying for FedRAMP Certification with an Agency Sponsor | These rules apply to cloud service providers with an Agency Sponsor who have met all other relevant rules and are ready to apply for any FedRAMP Certification. | Providers | Rev5 | Agency | B, C, D |
| `FRC-CCL` — Changing Certification Class | These rules apply to cloud service providers when changing their FedRAMP Certification Class. | Providers | Rev5 | Agency | A, B, C, D |

#### `IEC` — Incident Evaluation and Communication

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `IEC-FRP` — FedRAMP Responsibilities | These rules apply to FedRAMP. | FedRAMP | 20x, Rev5 | Program, Agency | B, C, D |
| `IEC-CSO` — General Provider Responsibilities | These rules apply to providers with FedRAMP Certifications of any type. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `IVV` — Independent Verification and Validation

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `IVV-CSO` — General Provider Responsibilities | These rules apply to cloud service providers obtaining and maintaining any FedRAMP Certification. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `IVV-IAS` — General Independent Assessor Responsibilities | These rules apply to independent assessment services supporting all FedRAMP Certification types. | Assessors | 20x, Rev5 | Program, Agency | B, C, D |

#### `MAS` — Minimum Assessment Scope

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `MAS-CSO` — General Provider Responsibilities | These rules apply to providers for any type of FedRAMP Certification. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `MKT` — Marketplace Listing

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `MKT-FRP` — FedRAMP Responsibilities | These rules apply to FedRAMP activities related to the FedRAMP Marketplace. | FedRAMP | 20x, Rev5 | Program, Agency | A, B, C, D |
| `MKT-CSO` — General Provider Responsibilities | These rules apply to providers seeking a listing in the FedRAMP Marketplace. | Providers | 20x, Rev5 | Program, Agency | A, B, C, D |
| `MKT-IAS` — General Assessor Responsibilities | These rules apply to independent assessment services seeking a listing in the FedRAMP Marketplace. | Assessors | None listed in source | None listed in source | None listed in source |
| `MKT-CAS` — General Advisor Responsibilities | These rules apply to consulting and advisory services seeking a listing in the FedRAMP Marketplace. | Advisors | None listed in source | None listed in source | None listed in source |
| `MKT-IIP` — Provider Responsibilities for Initial Implementation Phase Listings | FedRAMP allows cloud service providers that are actively preparing to obtain a FedRAMP Certification to apply for listing in the FedRAMP Marketplace. All cloud service providers must obtain a Initial Implementation Phase Marketplace Listing before they can apply for FedRAMP Certification. These rules apply to providers seeking a Initial Implementation Phase listing in the FedRAMP Marketplace. | Providers | 20x, Rev5 | Program, Agency | None listed in source |

#### `REC` — FedRAMP Recognition of Independent Assessment Services

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `REC-FRP` — FedRAMP Responsibilities | These rules apply to FedRAMP when evaluating independent assessment services for initial or ongoing FedRAMP Recognition. | FedRAMP | None listed in source | None listed in source | None listed in source |
| `REC-IAS` — General Independent Assessor Responsibilities | These rules apply to independent assessment services seeking to obtain or maintain FedRAMP Recognition. | Assessors | None listed in source | None listed in source | None listed in source |

#### `SCG` — Secure Configuration Guide

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `SCG-CSO` — General Provider Responsibilities | These rules apply to providers with FedRAMP Certifications of any type. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `SCG-ENH` — Enhanced Capabilities | These recommendations apply to providers with FedRAMP Certifications of any type. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `SCN` — Significant Change Notification

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `SCN-FRP` — FedRAMP Responsibilities | These rules apply to FedRAMP. | FedRAMP | 20x, Rev5 | Program, Agency | B, C, D |
| `SCN-CSO` — General Provider Responsibilities | These rules apply to providers with FedRAMP Certifications of any type. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `SCN-ADP` — Adaptive Changes | These rules apply to all adaptive significant changes. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `SCN-RTR` — Routine Recurring Changes | These rules apply to all routine recurring significant changes. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `SCN-TRF` — Transformative Changes | These rules apply to all transformative significant changes. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `SDR` — Security Decision Record

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `SDR-CSO` — General Provider Responsibilities | These rules apply to providers for FedRAMP Certifications of any type. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `VDR` — Vulnerability Detection and Response

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `VDR-CSO` — General Provider Responsibilities | These rules apply to all providers with FedRAMP Certifications of any type. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `VDR-TFR` — Timeframes | These rules apply to timeframes for vulnerability detection and response. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

#### `VER` — Vulnerability Evaluation and Reporting

| Subset | Description | Affects | Types | Paths | Classes |
|---|---|---|---|---|---|
| `VER-FRP` — FedRAMP Responsibilities | These rules apply to FedRAMP when setting expectations for specific cloud service providers. | FedRAMP | 20x, Rev5 | Program, Agency | B, C, D |
| `VER-AGM` — Agency Guidance | These rules for agencies apply to all agencies using a FedRAMP Certification. | Agencies | 20x, Rev5 | Program, Agency | B, C, D |
| `VER-EVA` — Evaluation | These rules apply to the evaluation of vulnerabilities. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `VER-RPT` — Reporting | These rules apply to reporting related to vulnerability detection and response. | Providers | 20x, Rev5 | Program, Agency | B, C, D |
| `VER-TFR` — Timeframes | These rules apply to timeframes for vulnerability detection and response. | Providers | 20x, Rev5 | Program, Agency | B, C, D |

## 3. Required Evidence and Artifact Process

### 3.1 Default Artifacts for FedRAMP Rules (FRR)

1. Explanation of how the rule is followed, or an explanation of the reason and resulting risk to customers for not following the rule.
2. Verification that the implementation is appropriate for the rule, or that the reason for not implementing is accepted by a senior official.
3. Validation that the implementation is in place and working as intended, or that the reason for not implementing is accepted by a senior official.
4. Independent verification.
5. Independent validation.

### 3.2 Default Artifacts for Key Security Indicators (KSI)

1. Explanation of measures (and their objectives) that demonstrate the Key Security Indicator, or an explanation of the reason and resulting risk to customers for not having measures available for that Key Security Indicator.
2. Explanation of the cycle for any measures that are implemented persistently (if applicable).
3. Verification that the measures demonstrate the Key Security Indicator, or that the reason for not having them is accepted.
4. Verification that the automation in place is accurate and sufficient to demonstrate appropriate measures for the Key Security Indicator, or that automation is not necessary for each measure.
5. Validation that the measures are accurately produced and are in place and working as intended, or that the reason for not having them is valid.

### 3.3 Deterministic Evidence Sequence

For each applicable rule or KSI:

1. Record the implementation or measure and its objective, or record the reason for not implementing it and the resulting customer risk.
2. Record the operating cycle for persistent measures, when applicable.
3. Verify that the requirement or measure is fulfilled, or document acceptance of the reason for nonimplementation by the required senior or accepting authority.
4. For automated KSI evidence, verify that the automation is accurate and sufficient, or document why automation is not necessary for the measure.
5. Validate that the implementation or measure is present, accurately produced, and working as intended, or document why the absence is valid and accepted.
6. Perform independent verification and independent validation where the FRR default artifact set applies.
7. When evidence is deterministic telemetry, collect it directly from an authoritative source as a factual, reproducible observation. Do not use probabilistic inference, predictive assessment, or generative-AI output to generate deterministic telemetry. (`FRD-DTM`)

## 4. Key Security Indicator Outcome Requirements

Each published KSI outcome is a standing security outcome to be demonstrated with evidence. A blank outcome statement in the page is not completed here.

### KSI-CED — Cybersecurity Education

- **`KSI-CED-RAT` — Reviewing All Training:** The effectiveness of relevant cybersecurity education and training is persistently reviewed, including at least general training for all employees, role-specific training for employees in high risk roles, training for development and engineering staff on secure software delivery, and training for staff involved with incident response or disaster recovery.
  - **Rev5 mapping in the page:** CP-3, IR-2, PS-6, AT-2, AT-2.2, AT-2.3, AT-3.5, AT-4, IR-2.3, AT-3, SR-11.1

### KSI-CMT — Change Management

- **`KSI-CMT-LMC` — Logging Changes:** Modifications to the cloud service offering are logged and monitored.
  - **Rev5 mapping in the page:** AU-2, CM-3, CM-3.2, CM-4.2, CM-6, CM-8.3, MA-2
- **`KSI-CMT-RMV` — Redeploying vs Modifying:** Changes to machine-based information resources are executed through the redeployment of version controlled resources rather than direct modification wherever reasonable.
  - **Rev5 mapping in the page:** CM-2, CM-3, CM-5, CM-6, CM-7, CM-8.1, SI-3
- **`KSI-CMT-RVP` — Reviewing Change Procedures:** The effectiveness of documented change management procedures is persistently reviewed.
  - **Rev5 mapping in the page:** CM-3, CM-3.2, CM-3.4, CM-5, CM-7.1, CM-9
- **`KSI-CMT-VTD` — Validating Throughout Deployment:** Persistent testing and validation of changes throughout deployment is automated.
  - **Rev5 mapping in the page:** CM-3, CM-3.2, CM-4.2, SI-2

### KSI-CNA — Cloud Native Architecture

- **`KSI-CNA-DFP` — Defining Functionality and Privileges:** The functionality and privileges for infrastructure and services are strictly defined.
  - **Rev5 mapping in the page:** CM-2, SI-3
- **`KSI-CNA-EIS` — Enforcing Intended State:** **Outcome statement not published in the source page.**
  - **Rev5 mapping in the page:** CA-2.1, CA-7.1
- **`KSI-CNA-IBP` — Implementing Best Practices:** The use and configuration of third-party machine-based information resources is persistently compared against the original provider's best practices and guidance.
  - **Rev5 mapping in the page:** AC-17.3, CM-2, PL-10
- **`KSI-CNA-MAT` — Minimizing Attack Surface:** Machine-based information resources are persistently reviewed to ensure they have a minimal attack surface and that lateral movement is minimized if compromised.
  - **Rev5 mapping in the page:** AC-17.3, AC-18.1, AC-18.3, AC-20.1, CA-9, SC-7.3, SC-7.4, SC-7.5, SC-7.8, SC-8, SC-10, SI-10, SI-11, SI-16
- **`KSI-CNA-OFA` — Optimizing for Availability:** Machine-based information resources are persistently reviewed to ensure they are appropriately optimized for high availability and rapid recovery.
- **`KSI-CNA-RNT` — Restricting Network Traffic:** Machine-based information resources are persistently reviewed to ensure they are appropriately configured to limit inbound and outbound network traffic.
  - **Rev5 mapping in the page:** AC-17.3, CA-9, CM-7.1, SC-7.5, SI-8
- **`KSI-CNA-RVP` — Reviewing Protections:** The effectiveness of protection against denial of service attacks and other unwanted activity for machine-based information resources is persistently reviewed.
  - **Rev5 mapping in the page:** SC-5, SI-8, SI-8.2
- **`KSI-CNA-ULN` — Using Logical Networking:** Logical networking and related capabilities are used and persistently reviewed to enforce traffic flow controls.
  - **Rev5 mapping in the page:** AC-12, AC-17.3, CA-9, SC-4, SC-7, SC-7.7, SC-8, SC-10

### KSI-IAM — Identity and Access Management

- **`KSI-IAM-AAM` — Automating Account Management:** The lifecycle and privileges of all accounts, roles, and groups are securely managed using automation.
  - **Rev5 mapping in the page:** AC-2.2, AC-2.3, AC-2.13, AC-6.7, IA-4.4, IA-12, IA-12.2, IA-12.3, IA-12.5
- **`KSI-IAM-APM` — Adopting Passwordless Methods:** Secure passwordless methods are used for user authentication and authorization when feasible, otherwise strong passwords with phishing-resistant MFA is used.
  - **Rev5 mapping in the page:** AC-3, IA-5.1, IA-5.2, IA-5.6, IA-6, AC-2, IA-2, IA-2.1, IA-2.2, IA-2.8, IA-5, IA-8, SC-23
- **`KSI-IAM-ELP` — Ensuring Least Privilege:** Identity and access management measures are used and persistently reviewed to ensure each user or device can only access the resources they need.
  - **Rev5 mapping in the page:** AC-2.5, AC-2.6, AC-3, AC-4, AC-6, AC-12, AC-14, AC-17, AC-17.1, AC-17.2, AC-17.3, AC-20, AC-20.1, CM-2.7, CM-9, IA-2, IA-3, IA-4, IA-4.4, IA-5.2, IA-5.6, IA-11, PS-2, PS-3, PS-4, PS-5, PS-6, SC-4, SC-20, SC-21, SC-22, SC-23, SC-39, SI-3
- **`KSI-IAM-JIT` — Authorizing Just-in-Time:** A least-privileged, role and attribute-based, and just-in-time security authorization model is used and persistently reviewed for all user and non-user accounts and services.
  - **Rev5 mapping in the page:** AC-2, AC-2.1, AC-2.2, AC-2.3, AC-2.4, AC-2.6, AC-3, AC-4, AC-5, AC-6, AC-6.1, AC-6.2, AC-6.5, AC-6.7, AC-6.9, AC-6.10, AC-7, AC-20.1, AC-17, AU-9.4, CM-5, CM-7, CM-7.2, CM-7.5, CM-9, IA-4, IA-4.4, IA-7, PS-2, PS-3, PS-4, PS-5, PS-6, PS-9, RA-5.5, SC-2, SC-23, SC-39
- **`KSI-IAM-SNU` — Securing Non-User Authentication:** Appropriately secure authentication methods are used and persistently reviewed for non-user accounts and services.
  - **Rev5 mapping in the page:** AC-2, AC-2.2, AC-4, AC-6.5, IA-3, IA-5.2, RA-5.5
- **`KSI-IAM-SUS` — Responding to Suspicious Activity:** Accounts with privileged access are disabled or otherwise secured in response to suspicious activity.
  - **Rev5 mapping in the page:** AC-2, AC-2.1, AC-2.3, AC-2.13, AC-7, PS-4, PS-8

### KSI-INR — Incident Response

- **`KSI-INR-AAR` — Generating After Action Reports:** Incident after action reports are generated and lessons learned are persistently incorporated.
  - **Rev5 mapping in the page:** IR-3, IR-4, IR-4.1, IR-8
- **`KSI-INR-RIR` — Reviewing Incident Response Procedures:** The effectiveness of documented incident response procedures is persistently reviewed.
  - **Rev5 mapping in the page:** IR-4, IR-4.1, IR-6, IR-6.1, IR-6.3, IR-7, IR-7.1, IR-8, IR-8.1, SI-4.5
- **`KSI-INR-RPI` — Reviewing Past Incidents:** Past incidents are persistently reviewed for patterns or vulnerabilities that were not previously apparent or identified.
  - **Rev5 mapping in the page:** IR-3, IR-4, IR-4.1, IR-5, IR-8

### KSI-MLA — Monitoring, Logging, and Auditing

- **`KSI-MLA-ALA` — Authorizing Log Access:** **Outcome statement not published in the source page.**
  - **Rev5 mapping in the page:** SI-11
- **`KSI-MLA-EVC` — Evaluating Configurations:** The configuration of machine-based information resources, especially infrastructure as code, is persistently evaluated and tested.
  - **Rev5 mapping in the page:** CA-7, CM-2, CM-6, SI-7.7
- **`KSI-MLA-LET` — Logging Event Types:** A list of information resources and event types that will be logged, monitored, and audited is maintained and persistently reviewed to ensure these activities occur.
  - **Rev5 mapping in the page:** AC-2.4, AC-6.9, AC-17.1, AC-20.1, AU-2, AU-7.1, AU-12, SI-4.4, SI-4.5, SI-7.7
- **`KSI-MLA-OSM` — Operating SIEM Capability:** A Security Information and Event Management (SIEM) or similar system(s) is used and persistently reviewed for centralized, tamper-resistant logging of events, activities, and changes.
  - **Rev5 mapping in the page:** AC-17.1, AC-20.1, AU-2, AU-3, AU-3.1, AU-4, AU-5, AU-6.1, AU-6.3, AU-7, AU-7.1, AU-8, AU-9, AU-11, IR-4.1, SI-4.2, SI-4.4, SI-7.7
- **`KSI-MLA-RVL` — Reviewing Logs:** Logs are persistently reviewed and audited.
  - **Rev5 mapping in the page:** AC-2.4, AC-6.9, AU-2, AU-6, AU-6.1, SI-4, SI-4.4

### KSI-PIY — Policy and Inventory

- **`KSI-PIY-GIV` — Generating Inventories:** Authoritative sources are used to automatically generate real-time inventories of all information resources when needed.
  - **Rev5 mapping in the page:** CM-2.2, CM-7.5, CM-8, CM-8.1, CM-12, CM-12.1, CP-2.8
- **`KSI-PIY-RES` — Reviewing Executive Support:** Executive support for achieving the provider's security goals is persistently reviewed and demonstrated.
- **`KSI-PIY-RIS` — Reviewing Investments in Security:** The effectiveness of the provider's investments in achieving security goals is persistently reviewed.
  - **Rev5 mapping in the page:** AC-5, CA-2, CP-2.1, CP-4.1, IR-3.2, PM-3, SA-2, SA-3, SR-2.1
- **`KSI-PIY-RSD` — Reviewing Security in the SDLC:** The effectiveness of building security and privacy considerations into the Software Development Lifecycle and aligning with CISA Secure By Design principles is persistently reviewed.
  - **Rev5 mapping in the page:** AC-5, AU-3.3, CM-3.4, PL-8, PM-7, SA-3, SA-8, SC-4, SC-18, SI-10, SI-11, SI-16
- **`KSI-PIY-RVD` — Reviewing Vulnerability Disclosures:** The effectiveness of the provider's vulnerability disclosure program is persistently reviewed.
  - **Rev5 mapping in the page:** RA-5.11

### KSI-RPL — Recovery Planning

- **`KSI-RPL-ABO` — Aligning Backups with Objectives:** The alignment of machine-based information resource backups with defined recovery objectives is persistently reviewed.
  - **Rev5 mapping in the page:** CM-2.3, CP-6, CP-9, CP-10, CP-10.2, SI-12
- **`KSI-RPL-ARP` — Aligning Recovery Plan:** The alignment of recovery plans with defined recovery objectives is persistently reviewed.
  - **Rev5 mapping in the page:** CP-2, CP-2.1, CP-2.3, CP-4.1, CP-6, CP-6.1, CP-6.3, CP-7, CP-7.1, CP-7.2, CP-7.3, CP-8, CP-8.1, CP-8.2, CP-10, CP-10.2
- **`KSI-RPL-RRO` — Reviewing Recovery Objectives:** The desired Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO) are defined and persistently reviewed for alignment with the provider's business needs and capabilities.
  - **Rev5 mapping in the page:** CP-2.3, CP-10
- **`KSI-RPL-TRC` — Testing Recovery Capabilities:** The capability to recover from incidents and contingencies aligned with defined recovery objectives is persistently tested.
  - **Rev5 mapping in the page:** CP-2.1, CP-2.3, CP-4, CP-4.1, CP-6, CP-6.1, CP-9.1, CP-10, IR-3, IR-3.2

### KSI-SCR — Supply Chain Risk

- **`KSI-SCR-MIT` — Mitigating Supply Chain Risk:** Persistently identify, review, and mitigate potential supply chain risks.
  - **Rev5 mapping in the page:** AC-20, RA-3.1, SA-9, SA-10, SA-11, SA-15.3, SA-22, SI-7.1, SR-5, SR-6, CA-7.4, SC-18
- **`KSI-SCR-MON` — Monitoring Supply Chain Risk:** Third party software information resources are automatically monitored for upstream vulnerabilities using mechanisms that may include contractual notification requirements or active monitoring services.
  - **Rev5 mapping in the page:** AC-20, CA-3, IR-6.3, PS-7, RA-5, SA-9, SI-5, SR-5, SR-6, SR-8

### KSI-SVC — Service Configuration

- **`KSI-SVC-ACM` — Automating Configuration Management:** The configuration of machine-based information resources is managed using automation and persistently reviewed for drift.
  - **Rev5 mapping in the page:** AC-2.4, CM-2, CM-2.2, CM-2.3, CM-6, CM-7.1, PL-9, PL-10, SA-5, SI-5, SR-10
- **`KSI-SVC-ASM` — Automating Secret Management:** Management, protection, and regular rotation of digital keys, certificates, and other secrets is automated and persistently reviewed.
  - **Rev5 mapping in the page:** AC-17.2, IA-5.2, IA-5.6, SC-12, SC-17
- **`KSI-SVC-EIS` — Evaluating and Improving Security:** Information resources are persistently evaluated for opportunities to improve security and those improvements are persistently made.
  - **Rev5 mapping in the page:** CM-7.1, CM-12.1, MA-2, PL-8, SC-7, SC-39, SI-2.2, SI-4, SR-10
- **`KSI-SVC-PRR` — Preventing Residual Risk:** **Outcome statement not published in the source page.**
  - **Rev5 mapping in the page:** SC-4
- **`KSI-SVC-RUD` — Removing Unwanted Data:** **Outcome statement not published in the source page.**
  - **Rev5 mapping in the page:** SI-12.3, SI-18.4
- **`KSI-SVC-SIN` — Securing Information:** Information is encrypted or otherwise secured from unwanted access or modification.
  - **Rev5 mapping in the page:** AC-1, AC-17.2, CP-9.8, SC-8, SC-8.1, SC-13, SC-20, SC-21, SC-22, SC-23, SC-28, SC-28.1
- **`KSI-SVC-VCM` — Validating Communications:** **Outcome statement not published in the source page.**
  - **Rev5 mapping in the page:** SC-23, SI-7.1
- **`KSI-SVC-VRI` — Validating Resource Integrity:** Use cryptographic methods to validate the integrity of machine-based information resources.
  - **Rev5 mapping in the page:** CM-2.2, CM-8.3, SC-13, SC-23, SI-7, SI-7.1, SR-10

## 5. Top-Level Deterministic Operating Process

The following sequence is a direct synthesis of the page’s model and rule IDs:

1. **Select the certification profile.** Choose Type × Path × Class and identify every applicable ruleset and subset. (`FRC-CSO-FCP`)
2. **Apply the relevant FedRAMP Practices.** Maintain the applicable KSI outcomes and all applicable rules.
3. **Create and maintain certification data.** Keep the Certification Package Overview, Security Decision Record, reports, notifications, and evidence current in the required human-readable and JSON forms.
4. **Run the vulnerability lifecycle persistently:** detect → evaluate → mitigate/remediate → report. (`VDR`, `VER`)
5. **Evaluate qualifying vulnerabilities for incident escalation.** Apply the class-specific MAY/SHOULD force, and run vulnerability remediation and incident reporting in parallel when escalation is selected or required by the page. (`VER-TFR-IRI`, `VER-TFR-NRI`, `IEC`)
6. **Evaluate every potential significant change.** Classify it and follow the matching notification track. (`SCN-CSO-EVA`)
7. **Supply ongoing certification reports and quarterly review access.** (`CCM`)
8. **Share certification data through a FedRAMP-compatible trust center.** Keep public, human-readable, machine-readable, programmatic, and access-log requirements satisfied. (`CDS`)
9. **Reapply for class changes.** Upgrades and downgrades require a new certification. (`FRC-CCL-UCC`, `FRC-CCL-DCC`)

## 6. Certification Requirements and Process

### 6.1 Explicit Certification Rules

- **`FRC-CSO-FCP` — FedRAMP Certification Profile — MUST.** Providers MUST identify a target FedRAMP Certification Profile and apply all relevant FedRAMP Practices to the cloud service offering.
- **`FRC-CSO-PKG` — FedRAMP Certification Package — MUST.** Providers seeking a Certification MUST supply a complete FedRAMP Certification Package to FedRAMP for initial certification; the FedRAMP Certification Package MUST include at least the following information:
  - **Source note:** The complete list is not embedded with the rule statement. The page’s corresponding Certification Package Overview schema requires `serviceIdentification`, `serviceProperties`, and `contactInformation` as top-level fields.
- **`FRC-CSO-JSN` — FedRAMP JSON Schemas — MUST.** Providers MUST supply machine-readable information in JSON documents that are valid against the corresponding JSON schema when a rule contains a FedRAMP JSON schema, UNLESS otherwise specified in the rule.
- **`FRC-CSO-POP` — Pick One Program Certification Type — MUST NOT.** Providers MUST NOT seek both FedRAMP Rev5 Program Certification and FedRAMP 20x Program Certification for the same cloud service offering; pick one type.
- **`FRC-CSO-MRA` — Maintain Responsibility and Accountability — MUST.** Providers MUST maintain responsibility and accountability for the accuracy and completeness of all information in the FedRAMP Certification Package, especially when they engage a third party (such as an independent assessor, advisory service, or external tools) to supply information on their behalf.
- **`FRC-CLA-ASF` — Approved Alternative Security Frameworks — MUST.** Providers seeking a FedRAMP Class A Certification MUST have completed a certification or equivalent process, including an independent assessment if applicable, from one of the following alternative security frameworks within the past 12 months:
  - **Source note:** The structured statement does not carry the list, but the page’s certification section identifies FedRAMP Rev5 (including FedRAMP Ready), SOC 2 Type II, and GovRAMP.
- **`FRC-CLA-MFR` — Mandatory FedRAMP Rules for Class A — MUST.** Providers seeking a Class A FedRAMP Certification MUST address all rules in this FedRAMP Class A Certification subset (FRC-CLA) AND the following additional FedRAMP Class A rules; the appropriate artifacts or information mapping for all rules MUST be supplied in the FedRAMP Certification Package.
  - **Source note:** The page does not embed the referenced list of additional Class A rules.
- **`FRC-APP-FCP` — Fresh FedRAMP Certification Package — MUST.** Providers MUST supply a fresh initial FedRAMP Certification Package that shows the current status of the cloud service offering as verified and validated by the provider within the previous 7 days.
- **`FRC-APP-NTP` — No Third-Party Applicants — MUST NOT.** Providers MUST NOT use a third party to apply for a FedRAMP Certification on their behalf; this includes independent assessment services.
- **`FRC-CCL-UCC` — Upgrading Certification Class — MUST.** Providers MUST apply for a new FedRAMP Certification to upgrade their Certification Class; all applicable requirements MUST be met in advance.
- **`FRC-CCL-DCC` — Downgrading Certification Class — MUST.** Providers MUST apply for a new FedRAMP Certification to downgrade their Certification Class.
- **`FRC-CCL-DNP` — Downgrade Notification Period — SHOULD.** Providers SHOULD notify all necessary parties at least 120 days in advance of an intended downgrade or cancellation of FedRAMP Certification.

### 6.2 Deterministic Certification Process

1. Identify a target Certification Profile and apply all relevant FedRAMP Practices. (`FRC-CSO-FCP`)
2. Prepare a complete initial FedRAMP Certification Package. (`FRC-CSO-PKG`)
3. Validate each required JSON document against its corresponding FedRAMP JSON schema. (`FRC-CSO-JSN`)
4. Maintain provider responsibility and accountability for the accuracy and completeness of the entire package, including third-party-supplied content. (`FRC-CSO-MRA`)
5. Do not seek both Rev5 Program and 20x Program certification for the same offering. (`FRC-CSO-POP`)
6. Before applying, verify and validate that the package reflects the current offering within the previous 7 days. (`FRC-APP-FCP`)
7. The provider must apply directly; a third party must not apply on the provider’s behalf. (`FRC-APP-NTP`)
8. For Class A, complete an approved alternative framework within the previous 12 months and address the mandatory Class A FedRAMP rule set. (`FRC-CLA-ASF`, `FRC-CLA-MFR`)
   - FedRAMP Rev5, including FedRAMP Ready, at any historical baseline.
   - SOC 2 Type II, with the complete report and a bridge or gap letter as applicable.
   - GovRAMP, at any impact level.
   - The page does not embed the list of additional Class A rules referenced by `FRC-CLA-MFR`.
9. To upgrade or downgrade class, apply for a new certification. (`FRC-CCL-UCC`, `FRC-CCL-DCC`) The page’s `FRC-CCL` subset metadata lists this subset as Rev5, Agency path, Classes A–D; the renderer describes class changes more broadly. This document does not reconcile that scope difference.
10. For an intended downgrade or cancellation, notify all necessary parties at least 120 days in advance. (`FRC-CCL-DNP`, SHOULD)

## 7. Vulnerability Detection and Response

### 7.1 Explicit VDR Rules

- **`VDR-CSO-DET` — Vulnerability Detection — MUST.** Providers MUST systematically, persistently, and promptly discover and identify vulnerabilities within their cloud service offering using appropriate techniques such as assessment, scanning, threat intelligence, vulnerability disclosure mechanisms, bug bounties, penetration testing, incident response, automated control testing, supply chain monitoring, and other relevant capabilities; this process is called vulnerability detection. Vulnerability detection includes persistently verifying and validating that information resources and processes are operating as intended and documented for FedRAMP Practices.
  - **Page caution:** Vulnerability Detection and Response includes all efforts to identify weaknesses in a system and is NOT limited to traditional vulnerability scanning or testing. An out-of-date control statement in the Security Decision Record is a vulnerability that must be detected and remediated just like any other vulnerability.
- **`VDR-CSO-RES` — Vulnerability Response — MUST.** Providers MUST systematically, persistently, and promptly track, evaluate, monitor, mitigate, remediate, assess exploitation of, report, and otherwise manage all detected vulnerabilities within their cloud service offering; this process is called vulnerability response.
- **`VDR-CSO-FAV` — Failures Are Vulnerabilities — MUST.** Providers MUST treat problems or failures with their vulnerability detection and response processes as vulnerabilities.
- **`VDR-CSO-DFR` — Design For Resilience — SHOULD.** Providers SHOULD make design and architecture decisions for their cloud service offering that mitigate the risk of vulnerabilities by default AND decrease the risk and complexity of vulnerability detection and response.
- **`VDR-CSO-ADT` — Automate Detection — SHOULD.** Providers SHOULD use automated services to improve and streamline vulnerability detection and response.
- **`VDR-CSO-DAC` — Detect After Changes — SHOULD.** Providers SHOULD automatically perform vulnerability detection on representative samples of new or significantly changed information resources.
- **`VDR-CSO-MSP` — Maintain Security — SHOULD NOT.** Providers SHOULD NOT weaken the security of information resources to facilitate vulnerability scanning, detection, or assessment activities.
- **`VDR-CSO-AKE` — Avoid KEVs — SHOULD NOT.** Providers SHOULD NOT deploy or otherwise activate new machine-based information resources with Known Exploited Vulnerabilities.
- **`VDR-CSO-SIR` — Sampling — MAY.** Providers MAY sample effectively identical information resources, especially machine-based information resources, when performing vulnerability detection UNLESS doing so would decrease the efficiency or effectiveness of vulnerability detection.

### 7.2 Detection and Verification Cadence by Class

| Rule | Activity | Class A | Class B | Class C | Class D |
|---|---|---:|---:|---:|---:|
| `VDR-TFR-PSD` | Persistent sample detection | SHOULD: 14 days | SHOULD: 7 days | SHOULD: 3 days | SHOULD: 1 day |
| `VDR-TFR-PDD` | Persistent drift detection | SHOULD: 3 months | SHOULD: 1 month | SHOULD: 14 days | SHOULD: 7 days |
| `VDR-TFR-PCD` | Persistently complete detection | SHOULD: 6 months | SHOULD: 6 months | SHOULD: 1 month | SHOULD: 1 month |
| `VDR-TFR-NMV` | Non-machine verification and validation | Not specified in source | Not specified in source | Not specified in source | Not specified in source |
| `VDR-TFR-MVX` | Persistent machine verification and validation for 20x | SHOULD: 1 month | MUST: 7 days | MUST: 3 days | Not specified in source |

- The page’s explanatory note states that non-machine verification and validation (`VDR-TFR-NMV`) is a **MUST every 3 months**, although the embedded cadence object contains no per-class values for this rule.
- The page’s explanatory note states that machine-resource verification and validation (`VDR-TFR-MVX`) is a **MUST at Classes B and C**. The embedded data gives Class A = SHOULD monthly, Class B = MUST every 7 days, Class C = MUST every 3 days, and no Class D value.

### 7.3 Deterministic Detection Process

For each information-resource population and process in the cloud service offering:

1. Select appropriate detection methods, including assessment, scanning, threat intelligence, vulnerability disclosure, bug bounty, penetration testing, incident response, automated control testing, supply-chain monitoring, and other relevant capabilities. (`VDR-CSO-DET`)
2. Run detection systematically, persistently, and promptly. (`VDR-CSO-DET`)
3. Verify and validate that information resources and processes operate as intended and documented for FedRAMP Practices. (`VDR-CSO-DET`)
4. Treat failures in the detection or response process as vulnerabilities. (`VDR-CSO-FAV`)
5. **SHOULD** use automated services to improve and streamline detection and response, and **SHOULD** automatically perform vulnerability detection on representative samples after new or significant changes. (`VDR-CSO-ADT`, `VDR-CSO-DAC`)
6. **SHOULD NOT** weaken resource security to make scanning or assessment easier. (`VDR-CSO-MSP`)
7. **SHOULD NOT** deploy or activate new machine-based resources with Known Exploited Vulnerabilities. (`VDR-CSO-AKE`)
8. **MAY** sample effectively identical resources only when sampling does not reduce detection efficiency or effectiveness. (`VDR-CSO-SIR`)

### 7.4 Deterministic Response and Resilience Process

1. **MUST** systematically, persistently, and promptly track, evaluate, monitor, mitigate, remediate, assess exploitation of, report, and otherwise manage every detected vulnerability. (`VDR-CSO-RES`)
2. **SHOULD** make design and architecture decisions that reduce vulnerability risk by default and reduce the risk and complexity of detection and response. (`VDR-CSO-DFR`)
3. **SHOULD** use automated services to improve and streamline response. (`VDR-CSO-ADT`)
4. **MUST** treat problems or failures in the response process as vulnerabilities and send them through the same lifecycle. (`VDR-CSO-FAV`)

## 8. Vulnerability Evaluation

### 8.1 Explicit Evaluation Rules

- **`VER-EVA-ELX` — Evaluate Exploitability — MUST.** Providers MUST evaluate detected vulnerabilities, considering the context of the cloud service offering, to determine if they are likely exploitable vulnerabilities.
- **`VER-EVA-EIR` — Evaluate Internet-Reachability — MUST.** Providers MUST evaluate detected vulnerabilities, considering the context of the cloud service offering, to determine if they are internet-reachable vulnerabilities.
- **`VER-EVA-EPA` — Estimate Potential Agency Impact — MUST.** Providers MUST evaluate detected vulnerabilities, considering the context of the cloud service offering, to estimate the potential agency impact of exploitation on government customers AND assign one of the following Potential Agency Impact N-ratings (PAIN):
  - **Source note:** The PAIN N1–N5 definitions are provided separately by the page and reproduced in Section 8.2.
- **`VER-EVA-AIA` — Assume It's Automatable — MUST.** Providers MUST assume the exploitation of vulnerabilities can be automated UNLESS they have evidence proving otherwise.
- **`VER-EVA-GRV` — Group Vulnerabilities — SHOULD.** Providers SHOULD evaluate detected vulnerabilities, considering the context of the cloud service offering, to identify logical groupings of affected information resources that may improve the efficiency and effectiveness of vulnerability response by consolidating further activity; FedRAMP Vulnerability Detection and Response rules are then applied to these consolidated groupings of vulnerabilities instead of each individual detected instance.
- **`VER-EVA-EFP` — Evaluate False Positives — SHOULD.** Providers SHOULD evaluate detected vulnerabilities, considering the context of the cloud service offering, to determine if they are false positive vulnerabilities.

### 8.2 PAIN Rating Definitions

- **N1**: Exploitation could be expected to have minimal customer effects on one or more agencies that use the cloud service offering.
- **N2**: Exploitation could be expected to have narrow customer effects on one or more agencies that use the cloud service offering.
- **N3**: Exploitation could be expected to have a disruptive customer effect on one agency that uses the cloud service offering.
- **N4**: Exploitation could be expected to have a debilitating customer effect on one agency that uses the cloud service offering OR a disruptive customer effect on more than one federal agency that uses the cloud service offering.
- **N5**: Exploitation could be expected to have a debilitating customer effect on more than one agency that uses the cloud service offering.

### 8.3 Evaluation Factors

- **Criticality**: How important are the systems or information that might be impacted by the vulnerability?
- **Reachability**: How might a threat actor reach the vulnerability and how likely is that?
- **Exploitability**: How easy is it for a threat actor to exploit the vulnerability and how likely is that?
- **Detectability**: How easy is it for a threat actor to become aware of the vulnerability and how likely is that?
- **Prevalence**: How much of the cloud service offering is affected by the vulnerability?
- **Privilege**: How much privileged authority or access is granted or can be gained from exploiting the vulnerability?
- **Proximate Vulnerabilities**: How does this vulnerability interact with previously detected vulnerabilities, especially partially or fully mitigated vulnerabilities?
- **Known Threats**: How might already known threats leverage the vulnerability and how likely is that?

### 8.4 Evaluation Deadline

| Rule | Class A | Class B | Class C | Class D |
|---|---:|---:|---:|---:|
| `VER-TFR-EVU` — evaluate all vulnerabilities after detection | SHOULD: 14 days | SHOULD: 7 days | SHOULD: 5 days | SHOULD: 2 days |

### 8.5 Deterministic Evaluation Process

For every detected vulnerability:

1. Record the detection time and source.
2. Complete evaluation within the class-specific `VER-TFR-EVU` timeframe.
3. Determine whether the vulnerability is likely exploitable. (`VER-EVA-ELX`)
4. Determine whether the vulnerability is internet-reachable. (`VER-EVA-EIR`)
5. Estimate Potential Agency Impact and assign PAIN N1 through N5. (`VER-EVA-EPA`)
6. Assume exploitation can be automated unless evidence proves otherwise. (`VER-EVA-AIA`)
7. Where useful, group logically related affected resources and apply VDR rules to the grouping. (`VER-EVA-GRV`, SHOULD)
8. Evaluate whether the finding is a false positive. (`VER-EVA-EFP`, SHOULD)
9. Use the resulting Class × PAIN × exploitability profile to select the remediation deadline.

## 9. Mitigation and Remediation Deadlines

The page states that the remediation clock starts from completed evaluation and is selected by Certification Class × PAIN rating × exploitability profile. The deadline may be met by mitigation or remediation. N1 has no matrix deadline. The embedded remediation matrix labels the timeframe force as **SHOULD** for Classes A, B, C, and D.

### 9.1 Internet-reachable and likely exploitable

| PAIN | Class A | Class B | Class C | Class D |
|---|---:|---:|---:|---:|
| N5 | 4 days | 4 days | 2 days | 12 hours |
| N4 | 8 days | 8 days | 4 days | 2 days |
| N3 | 32 days | 32 days | 16 days | 8 days |
| N2 | 96 days | 96 days | 48 days | 24 days |
| N1 | No deadline | No deadline | No deadline | No deadline |

### 9.2 Not internet-reachable and likely exploitable

| PAIN | Class A | Class B | Class C | Class D |
|---|---:|---:|---:|---:|
| N5 | 8 days | 8 days | 4 days | 1 day |
| N4 | 32 days | 32 days | 8 days | 8 days |
| N3 | 64 days | 64 days | 32 days | 16 days |
| N2 | 160 days | 160 days | 128 days | 96 days |
| N1 | No deadline | No deadline | No deadline | No deadline |

### 9.3 Not likely exploitable

| PAIN | Class A | Class B | Class C | Class D |
|---|---:|---:|---:|---:|
| N5 | 32 days | 32 days | 16 days | 8 days |
| N4 | 64 days | 64 days | 64 days | 32 days |
| N3 | 192 days | 192 days | 128 days | 64 days |
| N2 | 192 days | 192 days | 192 days | 192 days |
| N1 | No deadline | No deadline | No deadline | No deadline |

### 9.4 Deadline Selection Algorithm

1. If the vulnerability is in the CISA Known Exploited Vulnerabilities catalog, use the KEV catalog due date. The page states that this overrides the normal matrix and applies even if the vulnerability is already fully mitigated. (`VDR-TFR-KEV`, full force statement not embedded)
2. Otherwise, if PAIN = N1, the page provides no remediation deadline.
3. Otherwise, choose one profile:
   - Internet-reachable and likely exploitable.
   - Not internet-reachable and likely exploitable.
   - Not likely exploitable.
4. Look up the deadline by class and PAIN in the corresponding matrix above.
5. Track each completed reduction in PAIN and the target date and target PAIN for the next reduction.
6. If the provider intends to fix the vulnerability but misses the FedRAMP timeframe, classify it as an overdue vulnerability.
7. If the vulnerability is not fully mitigated or remediated within 192 days after evaluation, categorize it as an accepted vulnerability. (`VER-TFR-MAV`, full force statement not embedded)

### 9.5 Vulnerability State Definitions

- **Partially Mitigated Vulnerability (`FRD-PMV`):** A vulnerability where the likelihood or Potential Agency Impact N-rating has been reduced from the original evaluation but the risk of exploitation still exists and the vulnerability is still detected.
- **Fully Mitigated Vulnerability (`FRD-FMV`):** A vulnerability where the likelihood of exploitation or Potential Agency Impact N-rating has been reduced from the original evaluation until either are negligible, but the vulnerability is still detected.
- **Remediated Vulnerability (`FRD-RMV`):** A vulnerability that has been neutralized or eliminated and is no longer detected.
- **Accepted Vulnerability (`FRD-ACV`):** A vulnerability that the provider does not intend to fully mitigate or remediate, OR that has not or will not be fully mitigated or remediated within the maximum overdue period in FedRAMP Vulnerability Detection and Response rules.
- **Overdue Vulnerability (`FRD-ODV`):** A vulnerability that the provider intends to fully mitigate or remediate but has not or will not do so within the time frames recommended or required by FedRAMP.
- **False Positive Vulnerability (`FRD-FPV`):** A detected vulnerability that is not actually present in an exploitable state in the information resource
  - **Note:** This includes situations where vulnerable software or code exist on a machine-based information resource but are not loaded, running, or otherwise in an operating state required for exploitation. This only applies if the vulnerability is not and was not present; a remediated vulnerability or a fully mitigated vulnerability cannot also be a false positive vulnerability.

## 10. Vulnerability Reporting

### 10.1 Explicit Reporting Rules

- **`VER-RPT-PER` — Persistent Reporting — MUST.** Providers MUST report vulnerability detection and response activity (including persistent verification and validation) to all necessary parties persistently, summarizing ALL activity since the previous report; these reports are FedRAMP Certification Data and are subject to FedRAMP Certification Data Sharing rules.
- **`VER-RPT-VDT` — Vulnerability Details — MUST.** Providers MUST include the following information (if applicable) on detected vulnerabilities when reporting on vulnerability detection and response activity, UNLESS it is an accepted vulnerability:
  - **Required fields listed by the page:**
    - Provider's internally assigned tracking identifier
    - Time and source of the detection
    - Time of completed evaluation
    - Is it an internet-reachable vulnerability or not?
    - Is it a likely exploitable vulnerability or not?
    - Historically and currently estimated Potential Agency Impact N-rating of exploitation
    - Time and Potential Agency Impact N-rating of each completed and evaluated reduction in Potential Agency Impact N-rating
    - Estimated time and target Potential Agency Impact N-rating of next reduction in Potential Agency Impact N-rating
    - Is it currently or is it likely to become an overdue vulnerability or not? If so, explain.
    - Any supplementary information the provider responsibly determines will help federal agencies assess or mitigate the risk to their federal customer data within the cloud service offering resulting from the vulnerability
    - Final disposition of the vulnerability
- **`VER-RPT-AVI` — Accepted Vulnerability Info — MUST.** Providers MUST include the following information on accepted vulnerabilities when reporting on vulnerability detection and response activity:
  - **Required fields listed by the page:**
    - Provider's internally assigned tracking identifier
    - Time and source of the detection
    - Time of completed evaluation
    - Is it an internet-reachable vulnerability or not?
    - Is it a likely exploitable vulnerability or not?
    - Currently estimated Potential Agency Impact N-rating
    - Explanation of why this is an accepted vulnerability
    - Any supplementary information the provider determines will responsibly help federal agencies assess or mitigate the risk to their federal customer data within the cloud service offering resulting from the accepted vulnerability
- **`VER-RPT-NID` — Responsible Disclosure — MUST NOT.** Providers MUST NOT irresponsibly disclose specific sensitive information about vulnerabilities that would likely lead to exploitation, but MUST disclose sufficient information for informed risk-based decision-making to all necessary parties.
- **`VER-RPT-HLO` — High-Level Overviews — SHOULD.** Providers SHOULD include high-level overviews of ALL vulnerability detection and response activities conducted during this period for the cloud service offering; this includes vulnerability disclosure programs, bug bounty programs, penetration testing, assessments, etc.
- **`VER-RPT-RPD` — Responsible Public Disclosure — MAY.** Providers MAY responsibly disclose vulnerabilities publicly or with other parties if the provider determines doing so will NOT likely lead to exploitation.

### 10.2 Reporting Cadence and Retention

- **Human-readable vulnerability report:** At least every 1 month. The page references `VER-TFR-MHR`; the complete force statement is not embedded.
- **Historical machine-readable activity feed:**
  - Class A: MAY, update at least every 1 month.
  - Class B: SHOULD, update at least every 1 month.
  - Class C: SHOULD, update at least every 14 days.
  - Class D: SHOULD, update at least every 7 days.
- **Accepted-vulnerability threshold:** 192 days after evaluation if not fully mitigated or remediated.

### 10.3 Deterministic Vulnerability Reporting Process

For each reporting cycle:

1. Include all vulnerability detection and response activity since the previous report. (`VER-RPT-PER`)
2. For each non-accepted vulnerability, emit every field listed under `VER-RPT-VDT`.
3. For each accepted vulnerability, emit every field listed under `VER-RPT-AVI`.
4. Exclude specific sensitive details that would likely enable exploitation, but include enough information for informed risk-based decisions. (`VER-RPT-NID`)
5. Include a high-level overview of all vulnerability detection and response activities for the period. (`VER-RPT-HLO`, SHOULD)
6. Public disclosure is allowed only when the provider determines it will not likely lead to exploitation. (`VER-RPT-RPD`, MAY)
7. Treat the reports as FedRAMP Certification Data and share them under the Certification Data Sharing rules.

## 11. Incident Evaluation and Reporting

### 11.1 Explicit Incident Rules

- **`IEC-CSO-EFR` — Evaluate FedRAMP Reportability — MUST.** Providers MUST promptly evaluate incidents to determine if they affect confidentiality or integrity of federal customer data or are likely to affect confidentiality or integrity of federal customer data; such incidents are FedRAMP Reportable Incidents and must be reported following the FedRAMP Incident Evaluation and Communication rules.
- **`IEC-CSO-DPR` — Default PAIN Rating — MUST.** Providers MUST treat FedRAMP Reportable Incidents as if they have a Potential Agency Impact N-rating (PAIN) of 5 UNLESS they promptly estimate the PAIN rating following the rule in IEC-CSO-EFI (Estimate Federal Impact).
- **`IEC-CSO-EFI` — Estimate Federal Impact — SHOULD.** Providers SHOULD promptly estimate the likely adverse impact of an incident on agency customers to assign a Potential Agency Impact N-rating; this step is called Incident Rating.
- **`IEC-CSO-AIR` — Automated Incident Reporting — SHOULD.** Providers SHOULD use automation to minimize human intervention in the process of reporting FedRAMP Reportable Incidents to all affected parties.

### 11.2 Deterministic Incident Qualification Process

1. Promptly evaluate every incident to determine whether it affects, or is likely to affect, the confidentiality or integrity of federal customer data. (`IEC-CSO-EFR`)
2. If yes, classify it as a FedRAMP Reportable Incident and start the incident reporting process. The page emphasizes that availability alone is not part of this reportability test; an outage alone is not reportable under this test unless confidentiality or integrity is also affected or likely to be affected.
3. Until an incident PAIN rating is promptly estimated, treat the reportable incident as PAIN N5. (`IEC-CSO-DPR`)
4. Promptly estimate the likely adverse impact on agency customers and assign the incident PAIN rating. (`IEC-CSO-EFI`, SHOULD)
5. Use automation to minimize human intervention in reporting to all affected parties. (`IEC-CSO-AIR`, SHOULD)

### 11.3 Vulnerability-to-Incident Escalation

- **Internet-reachable + likely exploitable + PAIN N4 or N5:** The page states that the vulnerability may be treated as a FedRAMP Reportable Incident at Classes A and B and should be treated as one at Classes C and D until reduced to N3 or below. (`VER-TFR-IRI`)
- **Not internet-reachable + likely exploitable + PAIN N5:** The page states that the vulnerability may be treated as a reportable incident at Classes A, B, and C and should be treated as one at Class D. (`VER-TFR-NRI`)
- When escalated, keep the vulnerability remediation workflow active and run incident reporting in parallel.

### 11.4 Initial Incident Report Deadline

| PAIN | Class A | Class B | Class C | Class D |
|---|---:|---:|---:|---:|
| N5 | 6 hours | 6 hours | 1 hour | 15 minutes |
| N4 | 6 hours | 6 hours | 1 hour | 15 minutes |
| N3 | 6 hours | 6 hours | 1 hour | 15 minutes |
| N2 | 1 business day | 1 business day | 24 hours | 1 hour |
| N1 | 1 business day | 1 business day | 1 business day | 1 hour |
| **Force** | SHOULD | MUST | MUST | MUST |

### 11.5 Ongoing Incident Report Repeat Cadence

| PAIN | Class A | Class B | Class C | Class D |
|---|---:|---:|---:|---:|
| N5 | 1 business day | 1 business day | 6 hours | 3 hours |
| N4 | 1 business day | 1 business day | 6 hours | 3 hours |
| N3 | 1 business day | 1 business day | 6 hours | 3 hours |
| N2 | 1 business day | 1 business day | 24 hours | 6 hours |
| N1 | 1 business day | 1 business day | 1 business day | 24 hours |
| **Force** | SHOULD | MUST | MUST | MUST |

### 11.6 Final Incident Report Deadline After Recovery

| PAIN | Class A | Class B | Class C | Class D |
|---|---:|---:|---:|---:|
| N5 | 3 business days | 3 business days | 6 hours | 3 hours |
| N4 | 3 business days | 3 business days | 6 hours | 3 hours |
| N3 | 3 business days | 3 business days | 6 hours | 3 hours |
| N2 | 3 business days | 3 business days | 1 business day | 6 hours |
| N1 | 3 business days | 3 business days | 1 business day | 24 hours |
| **Force** | MUST | MUST | MUST | MUST |

### 11.7 Deterministic Incident Reporting Process

1. Start the reporting clock when the reportable incident is identified.
2. Submit the Initial Incident Report within the applicable Class × PAIN deadline.
3. While the incident remains active, submit Ongoing Incident Reports at the applicable repeat cadence.
4. After recovery, submit the Final Incident Report within the applicable deadline.
5. Validate incident report JSON against the incident report schema before submission.

## 12. Significant Change Process

### 12.1 Change-Type Definitions

- **Routine Recurring Change (`FRD-RTR`):** The type of significant change that regularly and routinely recurs as part of ongoing operations, vulnerability mitigation, or vulnerability remediation.
- **Adaptive Change (`FRD-ADP`):** A type of significant change that does not routinely recur and does not introduce substantive potential security risks that need to be assessed in depth.
  - **Note:** Adaptive changes typically require careful planning that focuses on engineering execution instead of customer adoption, can be verified with minor changes to existing automated validation procedures, and do not require large changes to operational procedures, deployment plans, or documentation.
- **Transformative Change (`FRD-TRF`):** The type of significant change that introduces substantive potential security risks that are likely to affect existing risk determinations and must be assessed in depth.
  - **Note:** Transformative changes typically introduce major features or capabilities that may change how a customer uses the service (in whole or in part) and require extensive updates to security assessments, operational procedures, deployment plans, and documentation.
- **Certification Class Change (`FRD-CCC`):** A type of significant change that is likely to change the FedRAMP Certification class for the entire cloud service offering (e.g. from Class B to Class C or from Class D to Class C).
- **Significant Change (`FRD-SGC`):** Has the meaning given in NIST SP 800-37 Rev. 2 which is "a change that is likely to substantively affect the security or privacy posture of a system."

### 12.2 Explicit Significant Change Rules

- **`SCN-CSO-EVA` — Evaluate Changes — MUST.** Providers MUST evaluate all potential significant changes to determine the type of significant change and follow the appropriate Significant Change Notification rules.
- **`SCN-ADP-NTF` — Notification Requirements — MUST.** Providers MUST notify all necessary parties within 10 business days after finishing adaptive changes, also including the following information:
  - **Source note:** The page does not embed the referenced adaptive-change information list.
- **`SCN-RTR-NNR` — No Notification Requirements — SHOULD NOT.** Providers SHOULD NOT make formal Significant Change Notifications for routine recurring changes; this type of change is exempted from notification requirements.
- **`SCN-TRF-NIP` — Notification of Initial Plans — MUST.** Providers MUST notify all necessary parties of initial plans for transformative changes at least 30 business days before starting transformative changes, including a summary of any likely security impacts or changes in risk.
- **`SCN-TRF-NFP` — Notification of Final Plans — MUST.** Providers MUST notify all necessary parties of final plans for transformative changes at least 10 business days before starting transformative changes, including updates to all previously sent information.
- **`SCN-TRF-NAF` — Notification After Finishing — MUST.** Providers MUST notify all necessary parties within 5 business days after finishing transformative changes, including updates to all previously sent information.
- **`SCN-TRF-NAV` — Notification After Verification — MUST.** Providers MUST notify all necessary parties within 5 business days after completing the verification, assessment, and/or validation of transformative changes, also including the following information:
  - **Source note:** The page does not embed the referenced post-verification information list.
- **`SCN-TRF-UPD` — Update Documentation — MUST.** Providers MUST publish updated service documentation and other materials to reflect transformative changes within 30 business days after finishing transformative changes.
- **`SCN-CSO-EMG` — Emergency Changes — MAY.** Providers MAY execute significant changes (including transformative changes) during an emergency or incident without following the Significant Change Notification rules in advance. In such emergencies, providers MUST follow all relevant procedures, notify all necessary parties, retroactively provide all Significant Change Notification materials, and complete appropriate assessment after the incident.
- **`SCN-CSO-HRM` — Human and Machine-Readable Notifications — MUST.** Providers MUST make ALL Significant Change Notifications and related audit records available in human-readable and JSON formats.
- **`SCN-CSO-HIS` — Historical Notifications — MUST.** Providers MUST keep 12 months of historical Significant Change Notifications available with their FedRAMP Certification Data.

### 12.3 Deterministic Significant Change Decision Process

1. Evaluate every potential significant change and classify its type. (`SCN-CSO-EVA`)
2. **Routine recurring change:** Do not make a formal Significant Change Notification. (`SCN-RTR-NNR`, SHOULD NOT)
3. **Adaptive change:** Notify all necessary parties within 10 business days after finishing. (`SCN-ADP-NTF`, MUST)
4. **Transformative change:**
   1. Notify initial plans at least 30 business days before starting. (`SCN-TRF-NIP`)
   2. Notify final plans at least 10 business days before starting. (`SCN-TRF-NFP`)
   3. Notify completion within 5 business days after finishing. (`SCN-TRF-NAF`)
   4. Notify verification, assessment, or validation results within 5 business days after completion. (`SCN-TRF-NAV`)
   5. Publish updated service documentation and materials within 30 business days after finishing. (`SCN-TRF-UPD`)
5. **Emergency or incident:** A significant change may be executed without advance notification, but all relevant procedures, notifications, materials, and post-incident assessment must be completed retroactively. (`SCN-CSO-EMG`)
6. Publish all notifications and audit records in both human-readable and JSON formats. (`SCN-CSO-HRM`)
7. Retain 12 months of historical Significant Change Notifications with the Certification Data. (`SCN-CSO-HIS`)
8. A certification class change requires a new certification. (`FRC-CCL-UCC`, `FRC-CCL-DCC`)

## 13. Collaborative Continuous Monitoring and Quarterly Review

### 13.1 Explicit CCM Rules

- **`CCM-OCR-AVL` — Report Availability — MUST.** Providers MUST supply an Ongoing Certification Report to all necessary parties every 3 months, covering the entire period since the previous summary, in a consistent format that is human readable; this report MUST include high-level summaries of at least the following information:
  - **Source note:** The complete summary list is not embedded with the statement. The page’s corresponding Ongoing Certification Report schema lists its required top-level fields in Section 15.
- **`CCM-OCR-NRD` — Next Report Date — MUST.** Providers MUST supply the target date for their next Ongoing Certification Report with other public FedRAMP Certification Data.
- **`CCM-OCR-FBM` — Feedback Mechanism — MUST.** Providers MUST supply an asynchronous mechanism for all necessary parties to provide feedback or ask questions about each Ongoing Certification Report.
- **`CCM-QTR-REG` — Meeting Registration Info — MUST.** Providers MUST supply either a registration link or a downloadable calendar file with meeting information for Quarterly Reviews to all necessary parties.
- **`CCM-QTR-SAR` — Schedule Around Reports — SHOULD.** Providers SHOULD regularly schedule Quarterly Reviews to occur at least 3 business days after releasing an Ongoing Certification Report AND within 10 business days of such release.

### 13.2 Deterministic Ongoing Monitoring Process

1. Every 3 months, supply an Ongoing Certification Report to all necessary parties covering the entire period since the previous report. (`CCM-OCR-AVL`)
2. Publish the target date for the next Ongoing Certification Report with public Certification Data. (`CCM-OCR-NRD`)
3. Provide an asynchronous feedback and question mechanism for each report. (`CCM-OCR-FBM`)
4. Provide a registration link or downloadable calendar file for Quarterly Reviews. (`CCM-QTR-REG`)
5. Schedule the Quarterly Review at least 3 business days after the report and within 10 business days after release. (`CCM-QTR-SAR`, SHOULD)

## 14. Certification Data Sharing and Trust Center Process

### 14.1 Explicit Data-Sharing Rules

- **`CDS-CSO-PUB` — Public Information — MUST.** Providers MUST publicly share up-to-date information about the cloud service offering in both human-readable and JSON formats, including at least the following information that is available and applicable:
  - **Source note:** The page does not embed the referenced list of public information items.
- **`CDS-CSO-UTC` — Use Trust Centers — MUST.** Providers MUST use a FedRAMP-compatible trust center to store and share FedRAMP Certification Data with all necessary parties.
- **`CDS-CSO-CBF` — Consistency Between Formats — MUST.** Providers MUST use automation to ensure information remains consistent between human-readable and machine-readable formats when FedRAMP Certification Data is provided in both formats.
- **`CDS-CSO-RIS` — Responsible Information Sharing — MUST.** Providers MUST provide sufficient information in FedRAMP Certification Data to support agency authorization decisions but SHOULD NOT include sensitive information that would likely enable a threat actor to gain unauthorized access, cause harm, disrupt operations, or otherwise have a negative adverse impact on the cloud service offering.
- **`CDS-TRC-USH` — Uninterrupted Sharing — MUST.** Trust centers MUST share FedRAMP Certification Data with all necessary parties without interruption.
- **`CDS-TRC-PAC` — Programmatic Access — MUST.** Trust centers MUST provide documented programmatic access to all FedRAMP Certification Data, including programmatic access to human-readable materials.
- **`CDS-TRC-ACL` — Access Logging — MUST.** Trust centers MUST log access to FedRAMP Certification Data and store summaries of access for at least six months; such information, as it pertains to specific parties, SHOULD be made available upon request by those parties.

### 14.2 Deterministic Data-Sharing Process

1. Publicly share current offering information in human-readable and JSON formats. (`CDS-CSO-PUB`)
2. Use a FedRAMP-compatible trust center for all Certification Data shared with necessary parties. (`CDS-CSO-UTC`)
3. Use automation to keep human-readable and machine-readable versions consistent. (`CDS-CSO-CBF`)
4. **MUST** share enough information for agency authorization decisions and **SHOULD NOT** include sensitive details likely to enable harm. (`CDS-CSO-RIS`)
5. The trust center must provide uninterrupted sharing. (`CDS-TRC-USH`)
6. The trust center must provide documented programmatic access to all Certification Data, including human-readable materials. (`CDS-TRC-PAC`)
7. The trust center must log Certification Data access and retain access summaries for at least 6 months. (`CDS-TRC-ACL`)
8. Access summaries pertaining to a specific party should be made available to that party on request. (`CDS-TRC-ACL`, SHOULD)

## 15. Machine-Readable Data Contracts

Whenever a rule contains a FedRAMP JSON schema, the provider must supply JSON that validates against that schema unless the rule states otherwise. (`FRC-CSO-JSN`)

### FedRAMP Accepted Vulnerability Info (VER-RPT-AVI)

- **File:** `fedramp-accepted-vulnerability-info-schema-2026-06-24.json`
- **Purpose:** Accepted vulnerability information required when reporting vulnerability detection and response activity per VER-RPT-AVI.
- **Required top-level fields:**
  - `certificationPackageOverviewUri`
  - `reportPeriod`
  - `acceptedVulnerabilities`

### FedRAMP Certification Package Overview (FRC-CSO-PKG)

- **File:** `fedramp-certification-package-overview-schema-2026-06-24.json`
- **Purpose:** Identification, service properties, contacts, and supporting documentation for a Cloud Service Offering per FRC-CSO-PKG.
- **Required top-level fields:**
  - `serviceIdentification`
  - `serviceProperties`
  - `contactInformation`

### FedRAMP Historical Vulnerability Evaluation and Reporting Activity (VER-TFR-MRH)

- **File:** `fedramp-historical-ver-activity-schema-2026-06-24.json`
- **Purpose:** Machine-readable historical Vulnerability Evaluation and Reporting activity for automated retrieval per VER-TFR-MRH.
- **Required top-level fields:**
  - `certificationPackageOverviewUri`
  - `generatedAt`
  - `activeVulnerabilities`
  - `acceptedVulnerabilities`

### FedRAMP Incident Report (IEC-CSO-IIR / IEC-CSO-OIR / IEC-CSO-FIR)

- **File:** `fedramp-incident-report-schema-2026-06-24.json`
- **Purpose:** Unified schema for the three incident report types in the IEC-CSO lifecycle: Initial (IEC-CSO-IIR), Ongoing (IEC-CSO-OIR), and Final (IEC-CSO-FIR).
- **Required top-level fields:**
  - `certificationPackageOverviewUri`
  - `reportType`
  - `providerTrackingId`

### FedRAMP Ongoing Certification Report (CCM-OCR-AVL)

- **File:** `fedramp-ongoing-certification-report-schema-2026-06-24.json`
- **Purpose:** Quarterly Ongoing Certification Report (OCR) per CCM-OCR-AVL, covering the entire period since the previous report.
- **Required top-level fields:**
  - `certificationPackageOverviewUri`
  - `reportPeriod`
  - `certificationDataChanges`
  - `plannedCertificationDataChanges`
  - `acceptedVulnerabilities`
  - `transformativeChanges`
  - `updatedRecommendations`
  - `activeAgencies`
  - `reportableIncidents`

### FedRAMP Security Decision Record (SDR-CSO-FRR)

- **File:** `fedramp-security-decision-record-schema-2026-06-24.json`
- **Purpose:** JSON Schema for Cloud Service Provider (CSP) system submission for FedRAMP certification per SDR-CSO-FRR.
- **Required top-level fields:**
  - `certificationPackageOverviewUri`
  - `fedRampRequirements`

### FedRAMP Significant Change Notification (SCN-CSO-INF)

- **File:** `fedramp-significant-change-notifications-schema-2026-06-24.json`
- **Purpose:** Required information for a Significant Change Notification per SCN-CSO-INF. Note per the rule: structure of the information may vary depending on how the provider tracks this internally.
- **Required top-level fields:**
  - `certificationPackageOverviewUri`
  - `changeType`
  - `changeDescription`

### FedRAMP Vulnerability Detail Report (VER-RPT-VDT)

- **File:** `fedramp-vulnerability-detail-report-schema-2026-06-24.json`
- **Purpose:** Vulnerability detection and response activity report per VER-RPT-VDT. Covers non-accepted vulnerabilities only; see VER-RPT-AVI for accepted vulnerabilities.
- **Required top-level fields:**
  - `certificationPackageOverviewUri`
  - `reportPeriod`
  - `vulnerabilities`

## 16. Deterministic End-to-End Vulnerability Algorithm

Use the following procedure for each detected vulnerability or logical vulnerability grouping:

1. **Detect and identify.** Assign an internal tracking ID and record detection time and source.
2. **Evaluate by class deadline.** Determine false-positive status, internet reachability, likely exploitability, and PAIN N1–N5. Assume exploitation is automatable unless disproved.
3. **Select the response clock.**
   1. If KEV, use the KEV catalog due date.
   2. Else if PAIN N1, no matrix deadline is stated.
   3. Else select the matrix lane and lookup Class × PAIN.
4. **Track risk reduction.** Record each completed PAIN reduction and the next planned reduction date and target PAIN.
5. **Mitigate or remediate.** Meet the selected deadline; keep fully mitigated vulnerabilities visible until remediated because they are still detected.
6. **Classify late states.** Mark missed intended timeframes as overdue. At 192 days without full mitigation or remediation, categorize as accepted.
7. **Escalate where applicable.** Apply the vulnerability-to-incident rules and start incident reports in parallel when the threshold and class force call for it.
8. **Report.** Emit the correct active or accepted field set, maintain the machine-readable feed, and supply the human-readable report on its cadence.
9. **Close.** Final disposition is remediated when the vulnerability is neutralized or eliminated and no longer detected; otherwise preserve the current state and reporting obligations.
10. **Audit the process itself.** Any failure in detection or response becomes a vulnerability and enters this same process.

## 17. Deterministic End-to-End Incident Algorithm

1. Detect or receive an incident signal.
2. Promptly test whether federal customer data confidentiality or integrity is affected or likely to be affected.
3. If not, the page does not classify it as a FedRAMP Reportable Incident under `IEC-CSO-EFR`.
4. If yes, classify it as reportable and initially use PAIN N5 unless a prompt incident rating is completed.
5. Select the initial-report deadline by Class × PAIN and submit the Initial Incident Report.
6. While active, submit Ongoing Incident Reports at the applicable Class × PAIN cadence.
7. After recovery, submit the Final Incident Report at the applicable Class × PAIN deadline.
8. Keep all reports consistent with the unified incident-report JSON schema and share them with all affected parties.

## 18. Deterministic End-to-End Significant Change Algorithm

1. Evaluate the proposed change for significance.
2. If not significant, the page provides no Significant Change Notification workflow.
3. If significant, classify it as routine recurring, adaptive, transformative, or certification class change.
4. Apply the matching notification and documentation schedule in Section 12.
5. Use human-readable and JSON notifications and keep 12 months of history.
6. During an emergency, execute first only under the emergency allowance, then retroactively complete the required notification materials and assessment.
7. For a class change, apply for a new certification and apply the downgrade/cancellation advance notice when relevant.

## 19. Assessor Recognition and Independence

- The page states that independent assessors obtain FedRAMP Recognition through A2LA accreditation under R311 and maintain it through surveillance and reassessment.
- The page states that an assessor cannot assess an offering that it advised within the prior 2 years.
- These statements appear in explanatory page text; no explicit rule ID or force word is embedded with them.
- An Advisor (`FRD-ADV`) may help a provider prepare for or maintain certification but does not replace provider responsibility or assessor independence.

## 20. Source Gaps and Unknowns

The following items are explicitly incomplete or absent in the supplied page and have not been filled from outside sources:

1. The page lists 17 rulesets and rule counts, but only a subset of individual rule statements is embedded in the data arrays used by the guide.
2. The following KSI outcome statements are blank in the page:
   - `KSI-CNA-EIS` — Enforcing Intended State
   - `KSI-MLA-ALA` — Authorizing Log Access
   - `KSI-SVC-PRR` — Preventing Residual Risk
   - `KSI-SVC-RUD` — Removing Unwanted Data
   - `KSI-SVC-VCM` — Validating Communications
3. `VDR-TFR-NMV` has no embedded per-class values, although the page’s explanatory note says it is a MUST every 3 months.
4. `VDR-TFR-MVX` has no embedded Class D value.
5. Several rule statements refer to following information or lists. Some are supplied elsewhere in the page (`VER-EVA-EPA`, `FRC-CLA-ASF`, and schema-level fields for `FRC-CSO-PKG` and `CCM-OCR-AVL`); the lists for `FRC-CLA-MFR`, `SCN-ADP-NTF`, `SCN-TRF-NAV`, and `CDS-CSO-PUB` are not embedded.
6. The complete underlying statements and force words for page-referenced IDs such as `VDR-TFR-KEV`, `VDR-TFR-PVR`, `VER-TFR-MAV`, `VER-TFR-MHR`, `VER-TFR-MRH`, `VER-TFR-IRI`, and `VER-TFR-NRI` are not all embedded. This document uses only the operational text and values that the page itself displays.
7. The VDR, VER, and IEC ruleset applicability metadata lists Classes B–D, while the page’s Class A narrative and several cadence, remediation, reporting, and incident matrices also contain Class A values. Both are retained without reconciliation.
8. The `FRC-CCL` subset metadata lists Rev5 and the Agency path, while the page renderer describes class-change rules in general terms. Both are retained without reconciliation.
9. No outside legal, regulatory, standards, or FedRAMP source was used to reconcile or supplement any omission or inconsistency.

## 21. Execution-Critical Definitions

- **Accepted Vulnerability (`FRD-ACV`):** A vulnerability that the provider does not intend to fully mitigate or remediate, OR that has not or will not be fully mitigated or remediated within the maximum overdue period in FedRAMP Vulnerability Detection and Response rules.
- **Advisor (`FRD-ADV`):** An entity that helps a provider understand, prepare for, or maintain FedRAMP Certification without replacing the provider's responsibility or the assessor's independence.
- **All Affected Parties (`FRD-AAP`):** All federal entities whose interests are affected directly or are likely to be affected directly in the event of a vulnerability or incident related to federal customer data. This always includes FedRAMP and directly impacted federal customer agencies.
- **All Necessary Assessors (`FRD-ANA`):** All entities who participate in the FedRAMP assessment of a cloud service offering in the context of a FedRAMP Certification. This always includes FedRAMP and any FedRAMP Recognized independent assessor contracted by a provider to perform a FedRAMP assessment.
- **All Necessary Parties (`FRD-ANP`):** All entities whose interests are affected directly by activity related to a specific cloud service offering in the context of FedRAMP Certifications. This always includes FedRAMP and any agency customer who is using the cloud service offering, but may include additional parties depending on agreements made by the cloud service provider (such as consultants or independent assessors). Potential agency customers or third-party cloud service providers should also be included in most cases but this is not a mandatory requirement under FedRAMP because the cloud service provider may choose who they wish to do business with.
- **Artifacts (`FRD-ART`):** Security-related materials that supply information regarding or evidence of functions, policies, decisions, procedures, operations, or other such activities, for the purposes of obtaining and maintaining a FedRAMP Certification. All such artifacts are considered FedRAMP Certification Data and are included in the FedRAMP Certification Package.
- **Assessor (`FRD-ASR`):** An assessor that performs assessment, verification, or validation activities for a cloud service offering seeking to obtain or maintain FedRAMP Certification; FedRAMP is the final assessor for FedRAMP Certification, but FedRAMP Recognized independent assessment services are typically also utilized.
  - **Note:** FedRAMP has transitioned from using the historical term "Third-Party Assessment Organization (3PAO)" to align with the explicit terminology used in the FedRAMP Authorization Act and to avoid the confusion caused when the same organizations provide both assessment and advisory services to different customers while being referred to as a 3PAO.
- **Certification Class (`FRD-CCL`):** The category of assurance that a cloud service offering supplies to federal government customers following FedRAMP Practices, increasing from minimal assurance at Class A to significant assurance at Class D; currently available categories are Class A, B, C, or D.
- **Certification Data (`FRD-CRD`):** The collective information required by FedRAMP for initial and ongoing FedRAMP Certification of a cloud service offering, including the FedRAMP Certification Package.
  - **Note:** In FedRAMP documentation, certification data always refers to FedRAMP Certification Data unless otherwise specified.
- **Certification Package (`FRD-CRP`):** Has meaning from 44 USC § 3607 (b)(8) given to "authorization package", which is "the essential information that can be used by an agency to determine whether to authorize the operation of an information system or the use of a designated set of common controls for all cloud computing products and services [certified] by FedRAMP."
  - **Note:** In FedRAMP documentation, certification package always refers to a FedRAMP Certification Package unless otherwise specified.
  - **Reference named by the page:** 44 USC § 3607 (b)(8)
- **Certification Path (`FRD-CPH`):** The underlying source of the FedRAMP Certification, either from a federal agency sponsored authorization to operate or directly from FedRAMP itself. The agency path is a legacy path that is only available for FedRAMP Rev5 and still requires review and approval from FedRAMP.
- **Certification Profile (`FRD-CPF`):** The combination of a FedRAMP Certification Type (Rev5 or 20x), FedRAMP Certification Path (Program or Agency), and FedRAMP Certification Class (A, B, C, or D) for a cloud service offering.
- **Certification Type (`FRD-CTY`):** The form of assurance that a cloud service offering supplies to federal government customers following FedRAMP Practices, either Rev5 or 20x. Rev5 follows a legacy approach based primarily on documented plans while 20x follows a modern approach based primarily on measured outcomes.
- **Cloud Service Offering (`FRD-CSO`):** A specific, packaged cloud computing product or service supplied by a cloud service provider for use by customers, that is the subject of a FedRAMP Certification.
  - **Note:** The FedRAMP Minimum Assessment Scope defines the full scope of the cloud service offering from the perspective of a FedRAMP Certification.
- **Debilitating Customer Effect (`FRD-DCE`):** An unwanted customer effect that interrupts use of the cloud service for most users or compromises the integrity or confidentiality of most federal customer data. If the adverse customer effect is unknown then it should be treated as if it is debilitating until proven otherwise.
- **Disruptive Customer Effect (`FRD-DCF`):** An unwanted customer effect that interrupts use of the cloud service for many users for less than 24 hours, or that compromises the integrity or confidentiality of large amounts or many types of federal customer data.
- **Drift (`FRD-DFT`):** Changes to information resources that cause deviations from the intended and assessed state; common forms of drift include changes to configurations, deployed software, privileges, running processes, and availability.
- **False Positive Vulnerability (`FRD-FPV`):** A detected vulnerability that is not actually present in an exploitable state in the information resource
  - **Note:** This includes situations where vulnerable software or code exist on a machine-based information resource but are not loaded, running, or otherwise in an operating state required for exploitation. This only applies if the vulnerability is not and was not present; a remediated vulnerability or a fully mitigated vulnerability cannot also be a false positive vulnerability.
- **Federal Customer Data (`FRD-FCD`):** All electronic information, content, and materials that an agency or its authorized users upload, store, or otherwise supply to a cloud service for processing or storage. This does NOT include account information, service metadata, analytics, telemetry, or other similar metadata generated by the cloud service provider.
  - **Note:** In the context of FedRAMP Certification, "federal customer data" ONLY ever refers to data owned by federal agency customers. Agreements and contracts with specific agencies may require providers to protect additional data or even transfer ownership of telemetry or usage data to the agency; always consult a lawyer that is familiar with company agreements and contracts when determining the scope of federal customer data.
- **FedRAMP Reportable Incident (`FRD-FRI`):** An incident that affects the confidentiality or integrity of federal customer data or is likely to affect the confidentiality or integrity of federal customer data.
- **Fully Mitigated Vulnerability (`FRD-FMV`):** A vulnerability where the likelihood of exploitation or Potential Agency Impact N-rating has been reduced from the original evaluation until either are negligible, but the vulnerability is still detected.
- **Incident (`FRD-INT`):** Has the meaning given in 44 USC § 3552 (b)(2) which is "an occurrence that (A) actually or imminently jeopardizes, without lawful authority, the integrity, confidentiality, or availability of information or an information system; or (B) constitutes a violation or imminent threat of violation of law, security policies, security procedures, or acceptable use policies."
  - **Reference named by the page:** 44 USC § 3552 (b)(2)
- **Information Resource (`FRD-IRS`):** Has the meaning from 44 USC § 3502 (6): "information and related resources, such as personnel, equipment, funds, and information technology." This includes any aspect of the cloud service offering, both technical and managerial, including everything that makes up the business of the offering from non-machine-based information resources like organizational policies, procedures, employees, etc. to machine-based information resources like hardware, software, cloud services, code, etc.
  - **Note:** Information resources are either machine-based or non-machine-based; any requirement or recommendation that references information resources without specifying a type is inclusive of all information resources.
  - **Reference named by the page:** 44 USC § 3502 (6)
- **Internet-Reachable Vulnerability (IRV) (`FRD-IRV`):** A vulnerability in a machine-based information resource that might be exploited or otherwise triggered by a payload originating from a source on the public internet.
  - **Note:** This includes machine-based information resources that have no direct route to/from the internet but receive payloads or otherwise take action triggered by internet activity. Internet-reachability applies only to the specific vulnerable machine-based information resources processing the payload. The opposite of this is a Not Internet-reachable Vulnerability (NIRV).
- **Known Exploited Vulnerability (KEV) (`FRD-KEV`):** Has the meaning given in CISA Binding Operational Directive 26-04, which is any vulnerability identified in CISA's Known Exploited Vulnerabilities catalog.
  - **Reference named by the page:** CISA BOD 26-04
- **Likely Exploitable Vulnerability (LEV) (`FRD-LEV`):** A vulnerability that is not fully mitigated AND is reachable by a likely threat actor; AND a likely threat actor with knowledge of the vulnerability would likely gain unauthorized access, cause harm, disrupt operations, or otherwise have an undesired adverse impact within the cloud service offering by exploiting the vulnerability.
  - **Note:** At the absolute minimum, any vulnerability that an automated unauthenticated system can exploit over the internet is a likely exploitable vulnerability. The opposite of this is a Not Likely Exploitable Vulnerability (NLEV).
- **Machine-Based (Information Resources) (`FRD-MBI`):** Any information technology information resource—including systems, processes, software, hardware, services, cloud-native capabilities, and any other such capability, component, or resource—that relies primarily on mechanical or electronic devices (i.e. computers) for operation.
  - **Note:** All other information resources that do not rely on computers are non-machine-based information resources.
- **Minimal Customer Effect (`FRD-MCE`):** An unwanted customer effect that is only noticeable by some users. This includes minor inconveniences such as reduced performance.
- **Narrow Customer Effect (`FRD-NCE`):** An unwanted customer effect that interrupts use of the cloud service for some users for less than 12 hours, or that compromises the integrity or confidentiality of an extremely limited amount and type of federal customer data.
- **Overdue Vulnerability (`FRD-ODV`):** A vulnerability that the provider intends to fully mitigate or remediate but has not or will not do so within the time frames recommended or required by FedRAMP.
- **Partially Mitigated Vulnerability (`FRD-PMV`):** A vulnerability where the likelihood or Potential Agency Impact N-rating has been reduced from the original evaluation but the risk of exploitation still exists and the vulnerability is still detected.
- **Potential Agency Impact (`FRD-PAI`):** The estimated cumulative effect of unauthorized access, disruption, harm, or other adverse impacts to all agencies using the cloud service that are likely to result from security incidents or the exploitation of vulnerabilities in the cloud service offering; as estimated following appropriate FedRAMP rules to calculate the Potential Agency Impact N-rating (PAIN).
  - **Note:** Potential Agency Impact N-rating (PAIN) levels are defined in VER-EVA-EPA (Estimate Potential Agency Impact)
- **Remediated Vulnerability (`FRD-RMV`):** A vulnerability that has been neutralized or eliminated and is no longer detected.
- **Routine Recurring Change (`FRD-RTR`):** The type of significant change that regularly and routinely recurs as part of ongoing operations, vulnerability mitigation, or vulnerability remediation.
- **Security Category (`FRD-SCT`):** Has the meaning from NIST FIPS 199, which is "The characterization of information or an information system based on an assessment of the potential impact that a loss of confidentiality, integrity, or availability of such information or information system would have on organizational operations, organizational assets, or individuals." Security categories are often referred to as "impact levels" and include Low, Moderate, and High.
  - **Reference named by the page:** NIST FIPS 199 Standards for Security Categorization of Federal Information and Information Systems
- **Security Decision Record (SDR) (`FRD-SDR`):** A persistently maintained, verified, and validated record of the security decisions made by a provider over the lifecycle of a cloud service offering. The Security Decision Record replaces the traditional System Security Plan and documents how applicable FedRAMP Practices are addressed, including implementation rationale, resulting customer risk, assessment findings, and supporting artifacts.
- **Significant Change (`FRD-SGC`):** Has the meaning given in NIST SP 800-37 Rev. 2 which is "a change that is likely to substantively affect the security or privacy posture of a system."
  - **Reference named by the page:** NIST SP 800-37 Rev. 2
- **Third-Party Information Resource (`FRD-TPR`):** Any information resource that is not entirely included in the Minimum Assessment Scope for the cloud service offering obtaining FedRAMP Certification.
- **Top-Level Administrative Account (`FRD-TLA`):** The most privileged account with the highest level of access within a cloud service offering for a customer organization, typically with complete control over all aspects of the cloud service offering, including managing resources, users, access, privileges, and the account itself.
  - **Note:** Any references to top-level administrative accounts in FedRAMP materials should be presumed to apply to top-level administrative roles or other similar capabilities that are used to assign top-level administrative account privileges.
- **Transformative Change (`FRD-TRF`):** The type of significant change that introduces substantive potential security risks that are likely to affect existing risk determinations and must be assessed in depth.
  - **Note:** Transformative changes typically introduce major features or capabilities that may change how a customer uses the service (in whole or in part) and require extensive updates to security assessments, operational procedures, deployment plans, and documentation.
- **Trust Center (`FRD-TRC`):** A secure repository or service used by cloud service providers to store and share FedRAMP Certification Data. Trust centers are the complete and definitive source for FedRAMP Certification Data and must follow the FedRAMP Certification Data Sharing rules to be FedRAMP-compatible.
  - **Note:** In FedRAMP documentation, all references to trust centers indicate FedRAMP-compatible trust centers unless otherwise specified.
- **Vulnerability (`FRD-VUL`):** Has the meaning given to "security vulnerability" in 6 USC § 650 (25), which is "any attribute of hardware, software, process, or procedure that could enable or facilitate the defeat of [...] management, operational, and technical controls used to protect against an unauthorized effort to adversely affect the confidentiality, integrity, and availability of an information system or its information." This includes gaps in Rev5 Controls and 20x Key Security Indicators, software vulnerabilities, misconfigurations, exposures, weak credentials, insecure services, and all other such potential weaknesses in protection (intentional or unintentional).
  - **Reference named by the page:** 6 USC § 650 (25)
- **Vulnerability Detection (`FRD-VLD`):** The systematic process of discovering and identifying security vulnerabilities in information resources through assessment, scanning, threat intelligence, vulnerability disclosure mechanisms, bug bounties, supply chain monitoring, and other capabilities. This process includes the initial discovery of a vulnerability's existence and the determination of affected information resources within a cloud service offering.
  - **Note:** This definition applies to other forms such as "detect vulnerabilities" or simply "detection" / "detected" used in FedRAMP materials.
- **Vulnerability Response (`FRD-VLR`):** The systematic process of tracking, evaluating, mitigating, monitoring, remediating, assessing exploitation, reporting, and otherwise managing detected vulnerabilities.
  - **Note:** This definition applies to other forms such as "respond to vulnerabilities" or simply "response" / "responded" used in FedRAMP materials.
