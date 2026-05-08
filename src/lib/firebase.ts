// Mock Firebase for visual-only mode as requested by user
export const auth: any = {
  currentUser: { uid: 'demo-id', email: 'admin@techcontrol.pro', displayName: 'Administrador Demo' },
  signOut: async () => {},
  onAuthStateChanged: (cb: any) => {
    cb({ uid: 'demo-id' });
    return () => {};
  }
};

export const db: any = {};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, _operationType: OperationType, _path: string | null) {
  console.error('Mock Firestore Error: ', error);
}
