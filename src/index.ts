class BTree<T> {
  data: T;
  left?: BTree<T>;
  right?: BTree<T>;
}

const tree: BTree<string> = {
  data: 'A',
  left: {
    data: 'B',
    left: {
      data: 'D',
    },
    right: {
      data: 'E',
    },
  },
  right: {
    data: 'C',
  },
};

type T = string;

function traverse(tree: BTree<T>): void {
  const stack = [];
  let node = tree;
  let prev;
  while (node) {
    console.log(node.data);
    stack.push(node);
    if (node.left) {
      node = node.left;
    } else if (node.right) {
      node = node.right;
    }
  }
}