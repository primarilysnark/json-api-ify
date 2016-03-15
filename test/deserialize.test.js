'use strict';

var async = require('async'),
    expect = require('chai').expect,
    Serializer = require('../index');

describe('deserialize', function() {
    it('should deserialize the payload successfully', function(done) {
        async.parallel([
            function(fn) {
                async.waterfall([
                    function(_fn) {
                        let serializer = new Serializer();
                        async.parallel([
                            function(__fn) {
                                serializer.define('photos', {}, __fn);
                            },

                            function(__fn) {
                                serializer.define('people', {
                                    id: '_id'
                                }, __fn);
                            }
                        ], function(err) {
                            if (err) {
                                return _fn(err);
                            }
                            _fn(null, serializer);
                        });
                    },

                    function(serializer, _fn) {
                        let payload = {
                            data: {
                                type: 'photos',
                                attributes: {
                                    title: 'Ember Hamster',
                                    src: 'http://example.com/images/productivity.png'
                                },
                                relationships: {
                                    photographer: {
                                        data: {
                                            type: 'people',
                                            id: '9'
                                        }
                                    }
                                }
                            }
                        };
                        serializer.deserialize(payload, function(err, data) {
                            expect(err).to.not.exist;
                            expect(data).to.be.an('object');
                            expect(data).to.have.property('photos').that.is.an('object');
                            expect(data.photos).to.have.all.keys('title', 'src', 'photographer');
                            expect(data.photos.photographer).to.equal('9');
                            expect(data).to.have.property('people').that.is.an('array');
                            expect(data.people).to.eql(['9']);
                            _fn(err);
                        });
                    }
                ], fn);
            },

            function(fn) {
                async.waterfall([
                    function(_fn) {
                        let serializer = new Serializer();
                        async.parallel([
                            function(__fn) {
                                serializer.define('photos', {}, __fn);
                            },

                            function(__fn) {
                                serializer.define('people', {
                                    id: '_id'
                                }, __fn);
                            }
                        ], function(err) {
                            if (err) {
                                return _fn(err);
                            }
                            _fn(null, serializer);
                        });
                    },

                    function(serializer, _fn) {
                        let payload = {
                            data: [{
                                type: 'photos',
                                attributes: {
                                    title: 'Ember Hamster',
                                    src: 'http://example.com/images/productivity.png'
                                },
                                relationships: {
                                    photographer: {
                                        data: {
                                            type: 'people',
                                            id: '9'
                                        }
                                    }
                                }
                            }, {
                                type: 'photos',
                                attributes: {
                                    title: 'Sweet Photo',
                                    src: 'http://example.com/images/sweet.png'
                                },
                                relationships: {
                                    photographer: {
                                        data: {
                                            type: 'people',
                                            id: '23'
                                        }
                                    },
                                    likes: {
                                        data: [{
                                            type: 'people',
                                            id: '9'
                                        },{
                                            type: 'people',
                                            id: '43'
                                        }]
                                    }
                                }
                            }]
                        };
                        serializer.deserialize(payload, function(err, data) {
                            expect(err).to.not.exist;
                            expect(data).to.be.an('object');
                            expect(data).to.have.property('photos').that.is.an('array');
                            expect(data.photos[0]).to.have.all.keys('title', 'src', 'photographer');
                            expect(data.photos[0]).to.have.property('photographer', '9');
                            expect(data.photos[0]).to.not.have.property('likes');
                            expect(data.photos[1]).to.have.all.keys('title', 'src', 'photographer', 'likes');
                            expect(data.photos[1]).to.have.property('photographer', '23');
                            expect(data.photos[1]).to.have.property('likes').that.is.an('array').with.lengthOf(2);
                            ['9', '43'].forEach(function(id) {
                                expect(data.photos[1].likes).to.contain(id);
                            });
                            expect(data).to.have.property('people').that.is.an('array').with.lengthOf(3);
                            ['9', '23', '43'].forEach(function(id) {
                                expect(data.people).to.contain(id);
                            });
                            _fn(err);
                        });
                    }
                ], fn);
            },

            function(fn) {
                async.waterfall([
                    function(_fn) {
                        let serializer = new Serializer();
                        serializer.define('people', {
                            id: '_id'
                        }, function(err) {
                            if (err) {
                                return _fn(err);
                            }
                            _fn(null, serializer);
                        });
                    },

                    function(serializer, _fn) {
                        let payload = {
                            data: {
                                type: 'people',
                                id: '12'
                            }
                        };
                        serializer.deserialize(payload, function(err, data) {
                            expect(err).to.not.exist;
                            expect(data).to.be.an('object');
                            expect(data).to.have.property('people', '12');
                            _fn(err);
                        });
                    }
                ], fn);
            },

            function(fn) {
                async.waterfall([
                    function(_fn) {
                        let serializer = new Serializer();
                        serializer.define('people', {
                            id: '_id'
                        }, function(err) {
                            if (err) {
                                return _fn(err);
                            }
                            _fn(null, serializer);
                        });
                    },

                    function(serializer, _fn) {
                        let payload = {
                            data: null
                        };
                        serializer.deserialize(payload, function(err, data) {
                            expect(err).to.not.exist;
                            expect(data).to.be.an('object');
                            let keys = Object.keys(data);
                            expect(keys).to.have.lengthOf(0);
                            _fn(err);
                        });
                    }
                ], fn);
            },

            function(fn) {
                async.waterfall([
                    function(_fn) {
                        let serializer = new Serializer();
                        serializer.define('people', {
                            id: '_id'
                        }, function(err) {
                            if (err) {
                                return _fn(err);
                            }
                            _fn(null, serializer);
                        });
                    },

                    function(serializer, _fn) {
                        let payload = {
                            data: []
                        };
                        serializer.deserialize(payload, function(err, data) {
                            expect(err).to.not.exist;
                            expect(data).to.be.an('object');
                            let keys = Object.keys(data);
                            expect(keys).to.have.lengthOf(0);
                            _fn(err);
                        });
                    }
                ], fn);
            },

            function(fn) {
                async.waterfall([
                    function(_fn) {
                        let serializer = new Serializer();
                        serializer.define('people', {
                            id: '_id'
                        }, function(err) {
                            if (err) {
                                return _fn(err);
                            }
                            _fn(null, serializer);
                        });
                    },

                    function(serializer, _fn) {
                        let payload = {
                            data: [
                                {type: 'people', id: '2'},
                                {type: 'people', id: '3'}
                            ]
                        };
                        serializer.deserialize(payload, function(err, data) {
                            expect(err).to.not.exist;
                            expect(data).to.be.an('object');
                            expect(data).to.have.property('people').that.is.an('array');
                            expect(data.people).to.eql(['2', '3']);
                            _fn(err);
                        });
                    }
                ], fn);
            }
        ], done);
    });

    it('should error when appropriate', function(done) {
        async.parallel([
            function(fn) {
                async.waterfall([
                    function(_fn) {
                        let serializer = new Serializer();
                        async.parallel([
                            function(__fn) {
                                serializer.define('user', {}, __fn);
                            },
                            function(__fn) {
                                serializer.define('group', {}, __fn);
                            }
                        ], function(err) {
                            if (err) {
                                return _fn(err);
                            }
                            _fn(null, serializer);
                        });
                    },

                    function(serializer, _fn) {
                        let badPayload = {
                            data: {
                                attributes: {
                                    first: 'bob',
                                    last: 'smith'
                                },
                                relationships: {
                                    groups: {
                                        data: [{id: 1}]
                                    }
                                }
                            }
                        };
                        serializer.deserialize(badPayload, function(err) {
                            expect(err).to.exist;
                            _fn(null, serializer);
                        });
                    },

                    function(serializer, _fn) {
                        let badPayload = {
                            meta: {
                                something: 'test',
                                somethingElse: 'test'
                            }
                        };
                        serializer.deserialize(badPayload, function(err) {
                            expect(err).to.exist;
                            _fn(null, serializer);
                        });
                    },

                    function(serializer, _fn) {
                        let badPayload = {
                            data: {
                                type: 'user',
                                attributes: {
                                    first: 'bob',
                                    last: 'smith'
                                },
                                relationships: {
                                    groups: {
                                        data: [{id: 1}]
                                    }
                                }
                            }
                        };
                        serializer.deserialize(badPayload, function(err) {
                            expect(err).to.exist;
                            _fn(null, serializer);
                        });
                    }
                ], fn);
            }
        ], done);
    });
});
