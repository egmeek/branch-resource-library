module.exports = {
    userprofile:{
      collection: "userprofiles",
      model: require("../models/userprofile"),
      populates: "role",
      exemptFromOwnership: false,
      exemptFromApproval: false,
      logViews: false,
      sort: {
        username: 1
      },
      limit: 10,
      requiresAuthentication: false    //only applies to GET requests. All other requests MUST be authenticated
    },
    project:{
      collection: "projects",
      model: require("../models/project"),
      populates: "userid category product status",
      exemptFromOwnership: false,
      exemptFromApproval: false,
      logViews: true,
      sort: {
        dateline: -1
      },
      limit: 20,
      requiresAuthentication: false    //only applies to GET requests. All other requests MUST be authenticated
    },
  publication:{
      collection: "publications",
      model: require("../models/publication"),
      populates: "",
      exemptFromOwnership: true,
      exemptFromApproval: true,
      logViews: false,
      sort: {
        dateline: -1
      },
      limit: 20,
      requiresAuthentication: false    //only applies to GET requests. All other requests MUST be authenticated
    },
    resource:{
      collection: "resources",
      model: require("../models/resource"),
      populates: "userid resourceType",
      exemptFromOwnership: false,
      exemptFromApproval: false,
      logViews: true,
      sort: {
        dateline: -1
      },
      limit: 20,
      requiresAuthentication: false    //only applies to GET requests. All other requests MUST be authenticated
    },
    certification: {
      collection: "certifications",
      model: require("../models/certification"),
      populates: "projectid",
      exemptFromOwnership: true,
      exemptFromApproval: true,
      logViews: false,
      limit: 10,
    },
    rating: {
      collection: "ratings",
      model: require("../models/rating"),
      populates: "userid",
      requiresAuthentication: true,
      exemptFromOwnership: false,
      exemptFromApproval: true,
      logViews: false,
      limit: 10,
    },
    subscription: {
      collection: "subscriptions",
      model: require("../models/subscription"),
      populates: "userid",
      requiresAuthentication: true,
      exemptFromOwnership: false,
      exemptFromApproval: true,
      logViews: false,
      limit: 10,
    },
    view: {
      collection: "views",
      model: require("../models/views"),
      populates: "userid",
      requiresAuthentication: false,
      exemptFromOwnership: true,
      exemptFromApproval: true,
      logViews: false,
      limit: 10,
    },
    article:{
      collection: "articles",
      model: require("../models/article"),
      populates: "userid",
      exemptFromOwnership: false,
      exemptFromApproval: false,
      logViews: true,
      sort: {
        dateline: -1
      },
      limit: 10,
      requiresAuthentication: false    //only applies to GET requests. All other requests MUST be authenticated
    },
    comment:{
      collection: "comments",
      model: require("../models/comment"),
      populates: "userid",
      exemptFromOwnership: false,
      exemptFromApproval: false,
      logViews: false,
      sort: {
        dateline: -1
      },
      limit: 10,
      requiresAuthentication: false    //only applies to GET requests. All other requests MUST be authenticated
    },
    userrole:{
      collection: "userroles",
      model: require("../models/userrole"),
      populates: "",
      exemptFromOwnership: true,
      exemptFromApproval: true,
      logViews: false,
      sort: {
        name: 1
      },
      requiresAuthentication: true    //only applies to GET requests. All other requests MUST be authenticated
    },
    feature:{
      collection: "features",
      model: require("../models/feature"),
      populates: "userid",
      exemptFromOwnership: true,
      exemptFromApproval: true,
      logViews: false,
      sort: {
        name: 1
      },
      requiresAuthentication: false    //only applies to GET requests. All other requests MUST be authenticated
    },
    projectcategories:{
      collection: "projectcategories",
      model: require("../models/projectcategory"),
      populates: "",
      exemptFromOwnership: true,
      exemptFromApproval: true,
      logViews: false,
      sort: {
        name: 1
      },
      requiresAuthentication: false    //only applies to GET requests. All other requests MUST be authenticated
    },
    product:{
      collection: "products",
      model: require("../models/product"),
      populates: "",
      exemptFromOwnership: true,
      exemptFromApproval: true,
      logViews: false,
      sort: {
        name: 1
      },
      requiresAuthentication: false    //only applies to GET requests. All other requests MUST be authenticated
    },
    picklist: {
      collection: "picklists",
      model: require("../models/picklist"),
      populates: "",
      exemptFromOwnership: true,
      exemptFromApproval: true,
      logViews: false,
      sort: {
        name: 1
      },
      requiresAuthentication: false
    },
    picklistitem: {
      collection: "picklistitems",
      model: require("../models/picklistitem"),
      populates: "",
      exemptFromOwnership: true,
      exemptFromApproval: true,
      logViews: false,
      sort: {
        seq: 1
      },
      requiresAuthentication: false
    },
    flag: {
      collection: "flags",
      model: require("../models/flag"),
      populates: "userid",
      exemptFromOwnership: true,
      exemptFromApproval: true,
      logViews: false,
      sort: {
        name: 1
      },
      requiresAuthentication: true
    }
};
