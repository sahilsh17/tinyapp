const { assert } = require('chai');

const { getUserByEmail } = require('../helper');
console.log("aaa");
const users = {
  '9dgwzx':
   { id: '9dgwzx',
     email: 'b@b.com',
     hashPassword: '$2b$10$HoRuEfjVc6yVYW6BUceTfeZyAtyI4oe1SwHR5l3o/9BUII2cK..BK' },
  'rh6w7h':
   { id: 'rh6w7h',
     email: 'c@c.com' }
  
};
describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("b@b.com", users);
    const expectedOutput = "9dgwzx";
    // Write your assert statement here
    
    assert.equal(user, expectedOutput);
  });
});
describe('getUserByEmail', function() {
  it('should return a undefined for non-existent email', function() {
    const user = getUserByEmail("d@d.com", users);
    const expectedOutput = undefined;
    // Write your assert statement here
    
    assert.equal(user, expectedOutput);
  });
});