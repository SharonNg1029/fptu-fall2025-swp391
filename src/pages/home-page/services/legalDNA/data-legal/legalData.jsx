import React from "react";
import {
  FaBaby,
  FaPassport,
  FaMoneyBillWave,
  FaHome,
  FaBuilding,
  FaMailBulk,
} from "react-icons/fa";

// ===== DỮ LIỆU DỊCH VỤ LEGAL DNA TESTING =====
export const legalServicesData = [
  {
    id: 1,
    name: "DNA Testing for Birth Certificate",
    type: "Legal",
    processingTime: "3-7 working days",
    basePrice: 3500000,
    expressPrice: 1500000,
    icon: <FaBaby className="text-xl" />,
    backgroundImage:
      "https://images2.thanhnien.vn/528068263637045248/2023/6/29/giay-khai-sinh-2-1688001417801425690462.jpg",
    description: `**DNA Testing for Birth Certificate**

Court-admissible DNA testing for official birth registration and legal documentation.

**When is DNA Testing Required for Birth Registration?**

DNA testing for birth registration is required in the following cases:

• Initial birth registration when the parents have not registered their marriage or registered their marriage after the child's birth.
• Changing the child's surname to the biological father's surname when the child was initially registered under the mother's surname.
• The biological father is in an existing marriage with another person (child born out of wedlock) and wishes to register the child's birth.
• The mother has not divorced or has been divorced for less than 300 days from a previous husband and has a child with another man, wishing to register the child with the biological father.
• One of the parents is a foreign national.
• Establishing parental rights or child support obligations.

**Note:** For detailed information, refer to [Cases Requiring DNA Testing for Birth Registration](https://thuvienphapluat.vn/phap-luat/co-bat-buoc-xet-nghiem-adn-cha-con-de-lam-giay-khai-sinh-hay-khong-theo-quy-dinh-phap-luat-hien-nay-572128-148310.html).

In the above cases, the child is not yet legally recognized as the biological child of both parents.

**DNA Test Results as Evidence**

According to [Article 14 of Circular 04/2020/TT-BTP](https://thuvienphapluat.vn/van-ban/Quyen-dan-su/Thong-tu-04-2020-TT-BTP-huong-dan-Luat-ho-tich-va-Nghi-dinh-123-2015-ND-CP-ve-ho-tich-446237.aspx) issued by the Ministry of Justice, DNA test results for birth registration serve as evidence to establish the parent-child relationship.

**Evidence to Prove Parent-Child Relationships**

Evidence includes:
• Documents issued by medical institutions, forensic agencies, or other competent authorities in Vietnam or abroad confirming the parent-child relationship.
• In the absence of such evidence, the parties acknowledging the parent-child relationship must provide a written declaration of the relationship as stipulated in Article 5 of the Circular, supported by at least two witnesses attesting to the parent-child relationship.

**Applications of DNA Test Results for Birth Registration**

With DNA test results as evidence of the parent-child relationship, families can proceed with the following procedures:
• Birth registration combined with parental acknowledgment: For children who have not yet been registered and need both biological parents' names included in the birth certificate and civil registry.
• Parental acknowledgment registration: For children who have already been registered with only the mother's or father's name and now require the addition of the other biological parent's name to the civil registry and birth certificate, or when the parent listed in the birth certificate is not the biological parent.
• Birth registration combined with parental acknowledgment involving foreign elements: For children who have not yet been registered and need both biological parents' names included in the birth certificate and civil registry, where one parent is a foreign national.

However, for DNA testing for birth registration, which falls under the category of administrative-legal DNA testing, the DNA testing specialist is required to directly collect DNA samples from the individuals being tested. Therefore, blood samples and oral mucosal samples (saliva) are prioritized.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***Legal DNA testing ensures complete chain of custody and court admissibility with >99.999999% accuracy***`,
  },
  {
    id: 2,
    name: "DNA Testing for Immigration, Sponsorship, or Citizenship Applications",
    type: "Legal",
    processingTime: "3-7 working days",
    basePrice: 6000000,
    expressPrice: 1500000,
    icon: <FaPassport className="text-xl" />,
    backgroundImage:
      "https://www.cis.vn/wp-content/uploads/2021/11/huong-dan-thu-tuc-xin-song-tich-cho-viet-kieu1.jpg",
    description: `**DNA Testing for Immigration and Citizenship**

Legal DNA testing specifically designed for immigration, family sponsorship, and citizenship applications.

This service is accepted by:
• Immigration authorities worldwide
• Embassies and consulates
• Citizenship application processes
• Family reunification programs
• Visa application procedures

**Documentation Provided:**
• Embassy-accepted test results
• Official certification letters
• Chain of custody documentation
• International compliance certificates
• Notarized reports

**Process Requirements:**
• Professional sample collection with witness verification
• Photographic identification of all participants
• Strict chain of custody protocols
• Compliance with international testing standards
• Multiple language support for documentation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***Internationally recognized results accepted by immigration authorities with >99.999999% accuracy***`,
  },
  {
    id: 3,
    name: "DNA Testing for Inheritance or Asset Division",
    type: "Legal",
    processingTime: "3-7 working days",
    basePrice: 4000000,
    expressPrice: 1500000,
    icon: <FaMoneyBillWave className="text-xl" />,
    backgroundImage:
      "https://images2.thanhnien.vn/528068263637045248/2023/6/15/thua-ke-16868272484361420781118.jpg",
    description: `**DNA Testing for Inheritance and Asset Division**

Court-admissible DNA testing for inheritance claims and asset division proceedings.

This service supports:
• Inheritance dispute resolution
• Estate planning verification
• Asset division proceedings
• Legal heir identification
• Will contest cases
• Probate court requirements

**Legal Applications:**
• Probate court proceedings
• Will contest cases
• Estate distribution
• Inheritance rights establishment
• Trust fund verification
• Family lineage confirmation

**Professional Standards:**
• Full chain of custody documentation
• Court-admissible results
• Legal expert testimony available
• Compliance with judicial requirements
• Detailed forensic reporting
• Multi-generational testing capability

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
***Court-approved testing for legal inheritance proceedings with >99.999999% accuracy***`,
  },
];

// ===== DỮ LIỆU PHƯƠNG THỨC LẤY MẪU LEGAL =====
export const legalCollectionMethodsData = [
  {
    name: "Home Collection",
    price: 300000,
    icon: <FaHome className="text-xl text-blue-600" />,
    description:
      "Professional sample collection at your home with legal documentation",
  },
  {
    name: "At Facility",
    price: 0,
    icon: <FaBuilding className="text-xl text-blue-600" />,
    description: "Visit our facility for certified legal sample collection",
  },
  {
    name: "Postal Delivery",
    price: 200000,
    icon: <FaMailBulk className="text-xl text-blue-600" />,
    description: "Legal collection kit with certified chain of custody",
  },
];