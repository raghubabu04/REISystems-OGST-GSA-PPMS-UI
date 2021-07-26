export interface IFeaturedItem {
  id: string;
  description: string;
  salesNumber: string;
  lotNumber: string;
  auctionId: string;
  closingTime?: string;
  type: string;
  location: string;
  predesignedUrls: string[];
}

export interface IAlertItem {
  text: string;
  startDate: string;
  endDate?: string;
}

export const autoPlaySpeed: number = 5000;

export const alertTestData: IAlertItem[] = [
  {
    text:
      "Vestibulum varius iaculis sapien at efficitur. Morbi nec ultrices nibh. Curabitur ac ultrices lectus, nec dapibus augue. Quisque elementum elit lectus, nec tempus neque lobortis at. Integer laoreet augue eu pretium scelerisque. Nullam lacus dui, condimentum id dolor in, efficitur facilisis libero. Ut iaculis lacus nec quam accumsan, molestie feugiat neque varius. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam tincidunt tellus quis turpis varius, eget tristique neque venenatis. Duis consequat pharetra libero, sit amet pulvinar enim tempor non. Maecenas vel metus tellus. Pellentesque commodo sit amet tortor facilisis auctor. Donec at hendrerit velit, vel finibus urna. Nulla scelerisque, lorem eu dapibus accumsan, lectus leo porta lacus, a commodo ipsum justo ut lectus. Maecenas eget tincidunt sapien. Curabitur lacinia nunc in dolor fermentum, a scelerisque magna rutrum. Vestibulum auctor leo at porta mattis. Maecenas at sollicitudin quam, eu ultrices ex. Maecenas nec volutpat nunc. Vestibulum interdum velit sed velit pulvinar, id rutrum dui pulvinar. Donec cursus fringilla dui et fermentum. In sed malesuada ex, nec eleifend lectus. Praesent eget erat sodales, aliquet velit eu, vulputate lacus. Etiam eleifend vulputate lorem, sit amet bibendum metus tincidunt eget. Cras odio felis, posuere laoreet dolor at, volutpat semper enim. Morbi et leo non nisi eleifend pellentesque. Duis gravida efficitur elit, sed euismod est. Sed elementum ante quam, eu posuere ante condimentum ac. Nulla risus erat, imperdiet non lacinia ut, elementum id mauris. Cras a nulla ac nisi faucibus scelerisque. Sed eget molestie elit. Cras non fringilla mauris, in volutpat libero. Aliquam non nisi magna. Duis elementum sollicitudin nisi, et aliquet turpis blandit eget. Integer sodales nibh eget libero tincidunt, sit amet volutpat dolor rutrum. Sed malesuada consectetur erat, eu sagittis mi bibendum vitae. Maecenas vitae massa arcu. Aenean auctor aliquam diam a aliquet. Morbi non commodo orci, eu consequat purus. Phasellus eu ornare nisl. Sed tincidunt justo ex, et iaculis est ultrices eu. In hac habitasse platea dictumst. Cras porttitor mauris eget enim maximus, non hendrerit nunc sagittis. Nunc auctor tincidunt magna id tristique. Phasellus consequat faucibus leo sed aliquam.",
    startDate: "Effective Monday March 23, 2020",
  },
  {
    text:
      "This feature is no longer recommended. Though some browsers might still support it, it may have already been removed from the relevant web standards, may be in the process of being dropped, or may only be kept for compatibility purposes. Avoid using it, and update existing code if possible; see the compatibility table at the bottom of this page to guide your decision. Be aware that this feature may cease to work at any time.",
    startDate: "Effective Monday April 01, 2020",
  },
];
