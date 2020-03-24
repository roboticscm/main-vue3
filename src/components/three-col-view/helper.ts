export const applyLeftGutterState = (leftGutterMore: boolean) => {
  let el = document.querySelector('#insideLeftGutter');
  if (leftGutterMore) {
    el.classList.remove('inside-left-gutter-more');
    el.classList.add('inside-left-gutter-less');
  } else {
    el.classList.remove('inside-left-gutter-less');
    el.classList.add('inside-left-gutter-more');
  }
};

export const leftCollapse = (
  split: any,
  leftGutterMore: boolean,
  lastLeftContentWidth: number,
  delta: number
): boolean => {
  const oldSizes = split.getSizes();
  let newSizes: any[];
  leftGutterMore = !leftGutterMore;
  if (leftGutterMore) {
    newSizes = [0, oldSizes[0] + oldSizes[1], oldSizes[2]];
  } else {
    newSizes = [lastLeftContentWidth, oldSizes[1] - lastLeftContentWidth + delta, oldSizes[2]];
  }

  split.setSizes(newSizes);

  applyLeftGutterState(leftGutterMore);

  return leftGutterMore;
};

export const applyRightGutterState = (rightGutterMore: boolean) => {
  let el = document.querySelector('#insideRightGutter');
  if (rightGutterMore) {
    el.classList.remove('inside-right-gutter-less');
    el.classList.add('inside-right-gutter-more');
  } else {
    el.classList.remove('inside-right-gutter-more');
    el.classList.add('inside-right-gutter-less');
  }
};

export const rightCollapse = (
  split: any,
  rightGutterMore: boolean,
  lastRightContentWidth: number,
  delta: number
): boolean => {
  const oldSizes = split.getSizes();
  let newSizes: any[];
  rightGutterMore = !rightGutterMore;

  if (rightGutterMore) {
    if (oldSizes[0] - delta == 0) {
      newSizes = [0, oldSizes[1] + oldSizes[2] + delta, 0];
    } else {
      newSizes = [oldSizes[0], oldSizes[1] + oldSizes[2], 0];
    }
  } else {
    if (oldSizes[0] - delta == 0) {
      newSizes = [0, oldSizes[1] + oldSizes[2] - lastRightContentWidth + delta, lastRightContentWidth];
    } else {
      newSizes = [
        oldSizes[0] + delta,
        oldSizes[1] + oldSizes[2] - lastRightContentWidth - delta,
        lastRightContentWidth
      ];
    }
  }

  split.setSizes(newSizes);
  applyRightGutterState(rightGutterMore);

  return rightGutterMore;
};
