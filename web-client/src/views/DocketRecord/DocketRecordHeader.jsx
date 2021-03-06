import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocketRecordHeader = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    navigateToPrintableDocketRecordSequence:
      sequences.navigateToPrintableDocketRecordSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
    printDocketRecordSequence: sequences.printDocketRecordSequence,
    toggleMobileDocketSortSequence: sequences.toggleMobileDocketSortSequence,
    updateSessionMetadataSequence: sequences.updateSessionMetadataSequence,
  },
  ({
    formattedCaseDetail,
    navigateToPrintableDocketRecordSequence,
    printDocketRecordSequence,
    toggleMobileDocketSortSequence,
    updateSessionMetadataSequence,
  }) => {
    const openDocketRecordPrintPreview = (options = {}) => {
      updateSessionMetadataSequence({
        key: `docketRecordSort.${formattedCaseDetail.caseId}`,
        value: 'byDate',
      });
      printDocketRecordSequence(options);
    };
    return (
      <React.Fragment>
        <div className="grid-container padding-0 docket-record-header">
          <div className="grid-row hide-on-mobile">
            <div className="tablet:grid-col-2">
              <select
                aria-label="docket record"
                className="usa-select margin-top-0 margin-bottom-2 sort"
                name={`docketRecordSort.${formattedCaseDetail.caseId}`}
                value={formattedCaseDetail.docketRecordSort}
                onChange={e => {
                  updateSessionMetadataSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              >
                {[
                  {
                    label: 'oldest',
                    value: 'byDate',
                  },
                  {
                    label: 'newest',
                    value: 'byDateDesc',
                  },
                  {
                    label: 'no. (ascending)',
                    value: 'byIndex',
                  },
                  {
                    label: 'no. (descending)',
                    value: 'byIndexDesc',
                  },
                ].map(item => (
                  <option key={item.value} value={item.value}>
                    Sort by {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="tablet:grid-col-10 text-right">
              <Button
                link
                aria-label="printable docket record"
                className="margin-right-0"
                icon="print"
                onClick={() => {
                  navigateToPrintableDocketRecordSequence({
                    docketNumber: formattedCaseDetail.docketNumber,
                  });
                }}
              >
                Printable Docket Record
              </Button>
            </div>
          </div>
          <div className="only-small-screens">
            <Button
              link
              aria-hidden="true"
              icon="print"
              onClick={() => {
                openDocketRecordPrintPreview({
                  openNewTab: true,
                  openNewView: false,
                });
              }}
            >
              Printable Docket Record
            </Button>
            <Button
              link
              aria-label="docket record sort"
              className="mobile-sort-docket-button text-left"
              onClick={() => {
                toggleMobileDocketSortSequence();
              }}
            >
              {formattedCaseDetail.docketRecordSort === 'byDate' &&
                'Oldest to newest'}
              {formattedCaseDetail.docketRecordSort === 'byDateDesc' &&
                'Newest to oldest'}
              {formattedCaseDetail.docketRecordSort === 'byIndex' &&
                'Order ascending'}
              {formattedCaseDetail.docketRecordSort === 'byIndexDesc' &&
                'Order descending'}
              <FontAwesomeIcon icon="sort" size="sm" />
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
