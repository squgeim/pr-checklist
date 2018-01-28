import PrRouter from '../../util/prRouter';

PrRouter.add('src', () => {
  const lines = [];

  lines.push('- [ ] Are you sure you are doing this?');
  lines.push('- [ ] Doing that?');

  return lines.join('\n');
});
