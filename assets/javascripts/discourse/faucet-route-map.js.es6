export default function(){
  this.route('faucet', function(){
    this.route('show', {path: '/' });
    this.route('histories', {path: '/histories' });
  });
};