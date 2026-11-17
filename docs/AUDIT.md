# Audit and handover — Portfolio V2

## Repository
Confirmed authenticated account karlcometawork-bit; fork karlcometawork-bit/KC-portfolio has admin/push permissions. Main initially 17b2a8a9c0b2a7d968828f4b23a7810057225044. No original-repository writes.
Pages was disabled at audit. No connector endpoint is available to change Pages settings or enable fork Actions.

## High-impact changes
Positioning and CTA, formal portrait, case-study order and strategy/tools/evidence/learning sections, About/GitHub contact, measurement limitations, privacy-safe gallery selection, keyboard lightbox focus restoration, menu state, filter pressed state, no-JS visible content, reduced motion, mobile typography and SEO/canonical metadata.

## Assets and structure
Existing site uses flat root paths; README incorrectly described assets subdirectories. Retain the flat paths to avoid breaking assets.
Identical CV files share blob 1795710006ffd52178aa5aa133a1825101f6e087. ZIPs, unused images, older PDF and JPG/WebP poster variants remain for access but are excluded from deployment. No deletions of unrelated assets.
Internal reports and a customer-photo creative excluded; public git history still contains original files. Removal from Pages does not make them private.

## Validation
Build script checks local paths, unique IDs, fragments and PDF signature. Browser test covers Pages subpath, 360/768/1440 viewport overflow, image decoding, navigation, filter results, keyboard modal, focus restoration, CV response, JavaScript errors and no-JS visibility. Screenshots uploaded by CI.
These tests must execute successfully before deployment is called tested. External LinkedIn identity/account destination and full CV contents still need verification; no live verification is asserted by this document.

## Remaining evidence
See EVIDENCE.md. Need reconciled PROHUB totals and publication permission; approved Next Wave and Wingman artifacts; original AOP CSR export; Next Wave employment dates; CV content review. Do not describe pending figures as verified results.
