import {
    name as PartyCreator
} from '../partyCreator';
import {
    Meteor
} from 'meteor/meteor';

import 'angular-mocks';

import {
    chai
} from 'meteor/practicalmeteor:chai';

import {
    sinon
} from 'meteor/practicalmeteor:sinon';

should();

describe('PartyCreator', function() {
    beforeEach(function(done) {
        window.module(PartyCreator);
        stubs.restoreAll();
        done();
    });

    describe('controller', function() {
        let $rootScope;
        let $componentController;
        const party = {
            _id: 'partyId'
        };

        beforeEach(function(done) {
            inject(function(_$rootScope_, _$componentController_) {
                $rootScope = _$rootScope_;
                $componentController = _$componentController_;
            });
            done();
        });

        function component(bindings) {
            return $componentController(PartyCreator, {
                $scope: $rootScope.$new(true)
            }, bindings);
        }

        it('should return an empty string if there is no party', function(done) {
            const controller = component({
                party: undefined
            });

            expect(controller.creator).to.be.equal('');
            done();
        });

        it('should say `me` if logged in is the owner', function(done) {
            const owner = 'userId';
            // Logged in
            stubs.create('userId', Meteor, 'userId').returns(owner);

            const controller = component({
                party: {
                    owner
                }
            });

            expect(controller.creator).to.be.equal('me');

            stubs.userId.restore();
            done();
        });

        it('should say `nobody` if user does not exist', function(done) {
            const owner = 'userId';
            // not Logged in
            stubs.create('userId', Meteor, 'userId').returns(null);
            // no user found
            stubs.create('findOne', Meteor.users, 'findOne').returns(undefined);

            const controller = component({
                party: {
                    owner
                }
            });

            expect(controller.creator).to.be.equal('nobody');

            stubs.userId.restore();
            stubs.findOne.restore();
            done();
        });

        it('should return user data if user exists and it is not logged one', function(done) {
            const owner = 'userId';
            // not Logged in
            stubs.create('userId', Meteor, 'userId').returns(null);
            // user found
            stubs.create('findOne', Meteor.users, 'findOne').returns('found');

            const controller = component({
                party: {
                    owner
                }
            });

            expect(controller.creator).to.be.equal('found');

            stubs.userId.restore();
            stubs.findOne.restore();
            done();
        });
    });
});
