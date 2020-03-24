export const getThemeColors = () => {
  const body: any = document.querySelector('body');
  return [
    {
      ['--bg-primary']: getComputedStyle(body as any)
        .getPropertyValue('--bg-primary')
        .trim()
    },
    {
      ['--bg-secondary']: getComputedStyle(body as any)
        .getPropertyValue('--bg-secondary')
        .trim()
    },
    {
      ['--bg-tertiary']: getComputedStyle(body as any)
        .getPropertyValue('--bg-tertiary')
        .trim()
    },
    {
      ['--bg-gradient-from']: getComputedStyle(body as any)
        .getPropertyValue('--bg-gradient-from')
        .trim()
    },
    {
      ['--bg-gradient-to']: getComputedStyle(body as any)
        .getPropertyValue('--bg-gradient-to')
        .trim()
    }
  ];
};
