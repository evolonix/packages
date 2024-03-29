import { faker } from '@faker-js/faker';
import { Widget } from '../lib/widgets/widgets.model';

// Generate 10 widgets using faker
const widgets: Widget[] = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  name: faker.word.noun(),
  description: faker.lorem.paragraph(),
  createdAt: faker.date.recent().getTime(),
}));

export default widgets;
