import { CaseListRowExternal } from './CaseListRowExternal';
import { CaseSearchBox } from './CaseSearchBox';
import { MyContactInformation } from './MyContactInformation';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseListRespondent = connect(
  {
    dashboardExternalHelper: state.dashboardExternalHelper,
    formattedCases: state.formattedCases,
  },
  ({ dashboardExternalHelper, formattedCases }) => {
    const renderTable = () => (
      <div className="margin-top-2">
        <table className="usa-table responsive-table dashboard" id="case-list">
          <thead>
            <tr>
              <th>
                <span className="usa-sr-only">Lead Case Indicator</span>
              </th>
              <th>Docket number</th>
              <th>Case title</th>
              <th>Date filed</th>
            </tr>
          </thead>
          <tbody>
            {formattedCases.map(item => (
              <CaseListRowExternal
                onlyLinkIfRequestedUserAssociated
                formattedCase={item}
                key={item.caseId}
              />
            ))}
          </tbody>
        </table>
      </div>
    );

    const renderTitle = () => <h2>My Cases</h2>;

    const renderEmptyState = () => (
      <>
        {renderTitle()}
        <p>You are not associated with any cases.</p>
      </>
    );

    const renderNonEmptyState = () => (
      <>
        <div className="grid-container padding-x-0">
          <div className="grid-row">
            <div className="tablet:grid-col-6 hide-on-mobile">
              <h2>My Cases</h2>
            </div>
          </div>
        </div>
        <div className="padding-top-205 show-on-mobile">
          <h2>My Cases</h2>
        </div>
        {renderTable()}
      </>
    );

    return (
      <>
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap-6">
            <div className="tablet:grid-col-8">
              {dashboardExternalHelper.showCaseList
                ? renderNonEmptyState()
                : renderEmptyState()}
            </div>
            <div className="tablet:grid-col-4">
              <CaseSearchBox />
              <MyContactInformation />
            </div>
          </div>
        </div>
      </>
    );
  },
);
