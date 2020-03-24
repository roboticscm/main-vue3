export class View {
  public init = (viewState: any): void => {
    console.log('init');
  };

  public onceLoad = async (store: any, viewstate: any): Promise<any> => {
    console.log('onceLoad');
  };

  public reload = async (): Promise<any> => {
    console.log('reload');
  };
}
