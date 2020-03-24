import { T } from '@/assets/js/locale/locale';

export const generateColumns = (viewState: any) => {
  const dynCols = [];
  viewState.columns
    .filter((it) => it.toLowerCase() !== 'id')
    .forEach((it) => {
      dynCols.push({
        title: T(`COMMON.LABEL.${it.toUpperCase()}`),
        name: it
      });
    });
  dynCols.unshift({
    title: T('COMMON.LABEL.NO'),
    name: 'no'
  });
  return dynCols;
};
