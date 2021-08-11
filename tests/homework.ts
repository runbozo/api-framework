import { assert } from 'chai';
import { allure } from 'allure-mocha/runtime';
import CoreApi from '../src/http/CoreApi';


describe('Проверка функционала удаления кота', async () => {
  before('Получение ID случайного котика', async () => {
    console.info('Setup:', 'выполняется запрос GET /getAllCats');
    const search_response = await CoreApi.getAllCats();
    assert.ok(search_response.status === 200);
    console.info('Setup:', 'выполнен запрос GET /getAllCats');
    allure.logStep(`выполнен запрос GET /getAllCats`);
    const random_group = Math.floor(Math.random() * search_response.data.groups.length)
    const get_group = search_response.data.groups[random_group]
    const random_cat_number = Math.floor(Math.random() * get_group.cats.length)
    global.random_cat = get_group.cats[random_cat_number].id
    allure.logStep(`ID случайного котика для теста: ${global.random_cat}`);
    console.info('Setup:', `ID случайного котика для теста: ${global.random_cat}`);
  });

  it('Удаление котика', async () => {

    const response = await allure.step(
        `выполнен запрос DELETE /removeCat c параметром ${global.random_cat}`,
        async () => {
        console.info('Test:', 'выполняется запрос DELETE /removeCat');
        const response = await CoreApi.removeCat(global.random_cat);
        const data = JSON.stringify(response.data, null, 2);
        allure.testAttachment(
          'response: removeCat',
            JSON.stringify(response.data, null, 2),
          'application/json'
        );
        assert.ok(response.status === 200);
        return response;
  });
    console.info('Test:', 'получен ответ на запрос DELETE /removeCat\n', response.data);

    await allure.step(
          'Проверка отсутствия котика в БД (запрос GET /getCatById)',
          async () => {
              console.info('Test:', 'выполняется запрос GET /getCatById');
              const response = await CoreApi.getCatById(global.random_cat);
              console.info('Test:', 'выполнен запрос GET /getCatById');
              assert.ok(response.status === 404);
          }
      );
  });
});
