import { ArchiveDraftDocumentModal } from '../DraftDocuments/ArchiveDraftDocumentModal';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailEdit } from '../CaseDetailEdit/CaseDetailEdit';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CaseDetailReadOnly } from './CaseDetailReadOnly';
import { ConfirmEditModal } from '../DraftDocuments/ConfirmEditModal';
import { DocumentDetailHeader } from './DocumentDetailHeader';
import { DocumentDisplayIframe } from './DocumentDisplayIframe';
import { DocumentMessages } from './DocumentMessages';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RecallPetitionModalDialog } from '../RecallPetitionModalDialog';
import { ServeToIrsModalDialog } from '../ServeToIrsModalDialog';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentDetail = connect(
  {
    caseDetail: state.caseDetail,
    caseDetailHelper: state.caseDetailHelper,
    clickServeToIrsSequence: sequences.clickServeToIrsSequence,
    documentDetailHelper: state.documentDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    gotoOrdersNeededSequence: sequences.gotoOrdersNeededSequence,
    messageId: state.messageId,
    navigateToPathSequence: sequences.navigateToPathSequence,
    navigateToPrintableCaseConfirmationSequence:
      sequences.navigateToPrintableCaseConfirmationSequence,
    removeSignatureFromOrderSequence:
      sequences.removeSignatureFromOrderSequence,
    setModalDialogNameSequence: sequences.setModalDialogNameSequence,
    showModal: state.showModal,
  },
  ({
    caseDetail,
    caseDetailHelper,
    clickServeToIrsSequence,
    documentDetailHelper,
    formattedCaseDetail,
    gotoOrdersNeededSequence,
    messageId,
    navigateToPathSequence,
    navigateToPrintableCaseConfirmationSequence,
    removeSignatureFromOrderSequence,
    setModalDialogNameSequence,
    showModal,
  }) => {
    const renderParentTabs = () => {
      return (
        <Tabs bind="currentTab" className="no-full-border-bottom tab-button-h2">
          {documentDetailHelper.showDocumentInfoTab && (
            <Tab
              id="tab-document-info"
              tabName="Document Info"
              title="Document Info"
            />
          )}

          <Tab id="tab-pending-messages" tabName="Messages" title="Messages" />
        </Tabs>
      );
    };
    const renderNestedTabs = () => {
      return (
        <Tabs bind="currentTab" className="no-full-border-bottom tab-button-h2">
          {documentDetailHelper.showDocumentInfoTab && (
            <Tab id="tab-document-info" tabName="Document Info">
              <div
                aria-labelledby="tab-document-info"
                id="tab-document-info-panel"
              >
                {documentDetailHelper.showCaseDetailsEdit && <CaseDetailEdit />}
                {documentDetailHelper.showCaseDetailsView && (
                  <CaseDetailReadOnly />
                )}
              </div>
            </Tab>
          )}
          <Tab id="tab-pending-messages" tabName="Messages">
            <div
              aria-labelledby="tab-pending-messages"
              id="tab-pending-messages-panel"
            >
              <DocumentMessages />
            </div>
          </Tab>
        </Tabs>
      );
    };

    const renderButtons = () => {
      return (
        <div className="document-detail__action-buttons">
          <div className="float-left">
            {caseDetailHelper.hasOrders &&
              documentDetailHelper.showViewOrdersNeededButton && (
                <Button
                  link
                  onClick={() => {
                    gotoOrdersNeededSequence({
                      docketNumber: caseDetail.docketNumber,
                    });
                  }}
                >
                  View Orders Needed
                </Button>
              )}

            {documentDetailHelper.isDraftDocument && (
              <div>
                {!documentDetailHelper.formattedDocument.signedAt && (
                  <Button
                    link
                    href={documentDetailHelper.formattedDocument.signUrl}
                    icon={['fas', 'pencil-alt']}
                  >
                    Apply Signature
                  </Button>
                )}
                {documentDetailHelper.showSignedAt && (
                  <>
                    Signed{' '}
                    {documentDetailHelper.formattedDocument.signedAtFormattedTZ}
                    {documentDetailHelper.showRemoveSignature && (
                      <Button
                        link
                        className="margin-left-2 no-wrap"
                        icon="trash"
                        onClick={() =>
                          removeSignatureFromOrderSequence({
                            caseDetail,
                            documentIdToEdit:
                              documentDetailHelper.formattedDocument.documentId,
                          })
                        }
                      >
                        Delete Signature
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="float-right">
            {documentDetailHelper.showAddCourtIssuedDocketEntryButton && (
              <Button
                className="margin-right-0"
                href={`/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/add-court-issued-docket-entry`}
                icon="plus-circle"
              >
                Add Docket Entry
              </Button>
            )}

            {documentDetailHelper.showEditDocketEntry && (
              <Button
                link
                className="margin-right-0 padding-bottom-0"
                href={`/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/edit`}
                icon={['fas', 'edit']}
              >
                Edit
              </Button>
            )}

            {documentDetailHelper.showEditCourtIssuedDocketEntry && (
              <Button
                link
                className="margin-right-0 padding-bottom-0"
                href={`/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/edit-court-issued`}
                icon={['fas', 'edit']}
              >
                Edit
              </Button>
            )}

            {documentDetailHelper.showPrintCaseConfirmationButton && (
              <Button
                className="margin-right-0"
                icon="print"
                onClick={() => {
                  navigateToPrintableCaseConfirmationSequence({
                    docketNumber: formattedCaseDetail.docketNumber,
                  });
                }}
              >
                Print Confirmation
              </Button>
            )}

            {documentDetailHelper.showServeToIrsButton && (
              <Button
                className="serve-to-irs margin-right-0"
                icon={['fas', 'clock']}
                onClick={() => clickServeToIrsSequence()}
              >
                Serve to IRS
              </Button>
            )}
            {documentDetailHelper.showRecallButton && (
              <span className="recall-button-box">
                <FontAwesomeIcon icon={['far', 'clock']} size="lg" />
                <span className="batched-message">Batched for IRS</span>
                <Button
                  className="recall-petition"
                  onClick={() =>
                    setModalDialogNameSequence({
                      showModal: 'RecallPetitionModalDialog',
                    })
                  }
                >
                  Recall
                </Button>
              </span>
            )}
            {documentDetailHelper.showSignDocumentButton && (
              <Button
                className="serve-to-irs margin-right-0"
                icon={['fas', 'edit']}
                onClick={() =>
                  navigateToPathSequence({
                    path: messageId
                      ? `/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/messages/${messageId}/sign`
                      : `/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/sign`,
                  })
                }
              >
                Sign This Document
              </Button>
            )}
          </div>
        </div>
      );
    };

    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container DocumentDetail">
          <DocumentDetailHeader />
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-5">{renderParentTabs()}</div>
              <div className="grid-col-7">{renderButtons()}</div>
            </div>

            <div className="grid-row grid-gap">
              <div className="grid-col-5">{renderNestedTabs()}</div>
              <div className="grid-col-7">
                <DocumentDisplayIframe />
              </div>
            </div>
          </div>
        </section>
        {showModal === 'ServeToIrsModalDialog' && <ServeToIrsModalDialog />}
        {showModal === 'RecallPetitionModalDialog' && (
          <RecallPetitionModalDialog />
        )}
        {showModal === 'ArchiveDraftDocumentModal' && (
          <ArchiveDraftDocumentModal />
        )}
        {showModal === 'ConfirmEditModal' && <ConfirmEditModal />}
      </>
    );
  },
);
