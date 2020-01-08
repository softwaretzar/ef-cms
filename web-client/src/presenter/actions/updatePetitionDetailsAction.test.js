import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updatePetitionDetailsAction } from './updatePetitionDetailsAction';

let updatePetitionDetailsInteractorStub;

presenter.providers.applicationContext = {
  ...applicationContext,
  getUseCases: () => ({
    updatePetitionDetailsInteractor: updatePetitionDetailsInteractorStub,
  }),
};

describe('updatePetitionDetailsAction', () => {
  beforeEach(() => {
    updatePetitionDetailsInteractorStub = jest
      .fn()
      .mockReturnValue({ docketNumber: '123-45' });
  });

  it('creates date from form month, day, year fields and calls the use case with form data for a waived payment', async () => {
    const result = await runAction(updatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123' },
        form: {
          paymentDateWaivedDay: '01',
          paymentDateWaivedMonth: '01',
          paymentDateWaivedYear: '2001',
          petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
        },
      },
    });

    expect(updatePetitionDetailsInteractorStub).toHaveBeenCalled();
    expect(updatePetitionDetailsInteractorStub.mock.calls[0][0]).toMatchObject({
      petitionDetails: {
        petitionPaymentStatus: Case.PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: '2001-01-01T05:00:00.000Z',
      },
    });
    expect(result.output).toEqual({
      alertSuccess: {
        title: 'Your changes have been saved.',
      },
      caseDetail: { docketNumber: '123-45' },
      caseId: '123-45',
      tab: 'caseInfo',
    });
  });

  it('creates date from form month, day, year fields and calls the use case with form data for a paid payment', async () => {
    const result = await runAction(updatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123' },
        form: {
          paymentDateDay: '01',
          paymentDateMonth: '01',
          paymentDateYear: '2001',
          petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
        },
      },
    });

    expect(updatePetitionDetailsInteractorStub).toHaveBeenCalled();
    expect(updatePetitionDetailsInteractorStub.mock.calls[0][0]).toMatchObject({
      petitionDetails: {
        petitionPaymentDate: '2001-01-01T05:00:00.000Z',
        petitionPaymentStatus: Case.PAYMENT_STATUS.PAID,
      },
    });
    expect(result.output).toEqual({
      alertSuccess: {
        title: 'Your changes have been saved.',
      },
      caseDetail: { docketNumber: '123-45' },
      caseId: '123-45',
      tab: 'caseInfo',
    });
  });

  it('creates IRS notice date from form month, day, year fields and calls the use case with form data', async () => {
    const result = await runAction(updatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123' },
        form: {
          irsDay: '01',
          irsMonth: '01',
          irsYear: '2001',
        },
      },
    });

    expect(updatePetitionDetailsInteractorStub).toHaveBeenCalled();
    expect(updatePetitionDetailsInteractorStub.mock.calls[0][0]).toMatchObject({
      petitionDetails: {
        irsNoticeDate: '2001-01-01T05:00:00.000Z',
      },
    });
    expect(result.output).toEqual({
      alertSuccess: {
        title: 'Your changes have been saved.',
      },
      caseDetail: { docketNumber: '123-45' },
      caseId: '123-45',
      tab: 'caseInfo',
    });
  });

  it('should send preferredTrialCity to the use case as null if it is not on the form', async () => {
    await runAction(updatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123' },
        form: {},
      },
    });

    expect(updatePetitionDetailsInteractorStub).toHaveBeenCalled();
    expect(updatePetitionDetailsInteractorStub.mock.calls[0][0]).toMatchObject({
      petitionDetails: {
        preferredTrialCity: null,
      },
    });
  });

  it('should send preferredTrialCity to the use case if it is on the form', async () => {
    await runAction(updatePetitionDetailsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123' },
        form: { preferredTrialCity: 'Somewhere, USA' },
      },
    });

    expect(updatePetitionDetailsInteractorStub).toHaveBeenCalled();
    expect(updatePetitionDetailsInteractorStub.mock.calls[0][0]).toMatchObject({
      petitionDetails: {
        preferredTrialCity: 'Somewhere, USA',
      },
    });
  });
});