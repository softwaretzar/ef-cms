export default test => {
  return it('the adc logs in', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: 'adc',
    });
    await test.runSequence('submitLoginSequence');
  });
};
