const {
  updateUserContactInformationInteractor,
} = require('./updateUserContactInformationInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { UnauthorizedError } = require('../../../errors/errors');

const contactInfo = {
  address1: '234 Main St',
  address2: 'Apartment 4',
  address3: 'Under the stairs',
  city: 'Chicago',
  country: 'Brazil',
  countryType: 'international',
  phone: '+1 (555) 555-5555',
  postalCode: '61234',
  state: 'IL',
};

describe('updateUserContactInformationInteractor', () => {
  it('updates the user and respondents in the case', async () => {
    const updateCaseSpy = jest.fn();
    const updateUserSpy = jest.fn();
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];
      },
      getPersistenceGateway: () => {
        return {
          getCasesByUser: () =>
            Promise.resolve([
              {
                ...MOCK_CASE,
                respondents: [
                  {
                    userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
                  },
                ],
              },
            ]),
          getUserById: () =>
            Promise.resolve(MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f']),
          updateCase: updateCaseSpy,
          updateUser: updateUserSpy,
        };
      },
    };
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
    expect(updateUserSpy).toHaveBeenCalled();

    expect(updateUserSpy.mock.calls[0][0].user).toMatchObject({
      contact: contactInfo,
    });
    expect(updateCaseSpy).toHaveBeenCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      respondents: [
        {
          ...contactInfo,
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
  });

  it('updates the user and practitioners in the case', async () => {
    const updateCaseSpy = jest.fn();
    const updateUserSpy = jest.fn();
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];
      },
      getPersistenceGateway: () => {
        return {
          getCasesByUser: () =>
            Promise.resolve([
              {
                ...MOCK_CASE,
                practitioners: [
                  {
                    userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
                  },
                ],
              },
            ]),
          getUserById: () =>
            Promise.resolve(MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f']),
          updateCase: updateCaseSpy,
          updateUser: updateUserSpy,
        };
      },
    };
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
    expect(updateUserSpy).toHaveBeenCalled();

    expect(updateUserSpy.mock.calls[0][0].user).toMatchObject({
      contact: contactInfo,
    });
    expect(updateCaseSpy).toHaveBeenCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      practitioners: [
        {
          ...contactInfo,
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
  });

  it('returns unauthorized error when user not authorized', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitioner',
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => {
        return {};
      },
    };
    let result = null;
    try {
      await updateUserContactInformationInteractor({
        applicationContext,
        contactInfo,
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('returns unauthorized error when the user attempts to update a different user not owned by themself', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];
      },
      getPersistenceGateway: () => {
        return {};
      },
    };
    let result = null;
    try {
      await updateUserContactInformationInteractor({
        applicationContext,
        contactInfo,
        userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });
});
