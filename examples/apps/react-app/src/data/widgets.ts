import { faker } from '@faker-js/faker';
import { Widget } from '../lib/widgets/widgets.model';

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Generate 10 widgets using faker
const names = faker.helpers.uniqueArray(faker.hacker.noun, 10);
const widgets: Widget[] = Array.from({ length: 10 }, (_, index) => ({
  id: faker.string.uuid(),
  name: capitalize(names[index]),
  description: faker.lorem.paragraph(),
  createdAt: faker.date.recent({ days: 28 }).getTime(),
}));

export default widgets;
