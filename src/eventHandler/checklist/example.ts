import PrRouter from '../../util/prRouter';
import Checklist from '../../util/checkList';

PrRouter.add('src', () => {
  const lines = new Checklist();

  lines.push('Are you sure you are doing this?');
  lines.push('Doing that?');

  return lines.getList();
});
