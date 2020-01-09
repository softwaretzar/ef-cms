import { AppComponentPublic } from './views/AppComponentPublic';
import {
  back,
  createObjectURL,
  externalRoute,
  revokeObjectURL,
  route,
  // router,
} from './routerPublic';

// Icons - Solid
import { faArrowAltCircleLeft as faArrowAltCircleLeftSolid } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleLeft';
import { faFileAlt as faFileAltSolid } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';

// Icons - Regular
import { faArrowAltCircleLeft as faArrowAltCircleLeftRegular } from '@fortawesome/free-regular-svg-icons/faArrowAltCircleLeft';
import { faTimesCircle as faTimesCircleRegular } from '@fortawesome/free-regular-svg-icons/faTimesCircle';
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser';
import { library } from '@fortawesome/fontawesome-svg-core';

import { Provider } from 'overmind-react';
import { createOvermind } from 'overmind';
import { presenter } from './presenter/presenter-public';

import { render } from 'react-dom';
import React from 'react';

/**
 * Instantiates the Cerebral app with React
 */
const appPublic = {
  initialize: (applicationContext, options) => {
    library.add(
      faFileAltSolid,
      faPrint,
      faSearch,
      faSync,
      faTimesCircle,
      faTimesCircleRegular,
      faArrowAltCircleLeftSolid,
      faArrowAltCircleLeftRegular,
      faUser,
    );

    presenter.providers.applicationContext = applicationContext;
    presenter.state.cognitoLoginUrl = applicationContext.getCognitoLoginUrl();

    presenter.state.constants = applicationContext.getConstants();

    presenter.providers.router = {
      back,
      createObjectURL,
      externalRoute,
      revokeObjectURL,
      route,
    };

    const overmindApp = createOvermind(presenter, options);

    render(
      <Provider value={overmindApp}>
        <AppComponentPublic />
        {process.env.CI && <div id="ci-environment">CI Test Environment</div>}
      </Provider>,
      document.querySelector('#app-public'),
    );
  },
};

export { appPublic };
