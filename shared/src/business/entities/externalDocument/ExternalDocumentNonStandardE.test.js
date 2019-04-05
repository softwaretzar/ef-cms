const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardE', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard E',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        documentType: 'You must select a document type.',
        trialLocation: 'You must select a trial location.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Motion',
        documentType:
          'Motion to Change Place of Submission of Declaratory Judgment Case to [Place]',
        scenario: 'Nonstandard E',
        trialLocation: 'Little Rock, AR',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
