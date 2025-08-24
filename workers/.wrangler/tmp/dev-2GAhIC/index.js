var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-tRjly1/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-tRjly1/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/index.js
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
var users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", age: 65, skills: ["Email", "Internet"] },
  { id: 2, name: "Bob Smith", email: "bob@example.com", age: 72, skills: ["Video Calls", "Social Media"] },
  { id: 3, name: "Carol Davis", email: "carol@example.com", age: 68, skills: ["Online Shopping", "Banking"] }
];
var skills = [
  { id: 1, userId: 1, name: "Email", category: "Communication", level: "Advanced", dateAdded: "2024-01-15" },
  { id: 2, userId: 1, name: "Internet Browsing", category: "General", level: "Intermediate", dateAdded: "2024-01-16" },
  { id: 3, userId: 2, name: "Video Calls", category: "Communication", level: "Beginner", dateAdded: "2024-01-17" }
];
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }
    try {
      if (path === "/api/users" && method === "GET") {
        return handleGetUsers();
      } else if (path === "/api/users" && method === "POST") {
        return handleRegisterUser(request);
      } else if (path === "/api/users/validate" && method === "POST") {
        return handleValidateData(request);
      } else if (path === "/api/skills" && method === "GET") {
        return handleGetSkills(url);
      } else if (path === "/api/skills" && method === "POST") {
        return handleAddSkill(request);
      } else if (path.startsWith("/api/skills/") && method === "PUT") {
        return handleUpdateSkill(request, path);
      } else if (path.startsWith("/api/skills/") && method === "DELETE") {
        return handleDeleteSkill(path);
      } else if (path === "/api/skills/stats" && method === "GET") {
        return handleGetSkillStats();
      } else if (path === "/api/email/process" && method === "POST") {
        return handleProcessEmailData(request);
      } else if (path === "/api/reports/generate" && method === "POST") {
        return handleGenerateReport(request);
      } else if (path === "/api/data/backup" && method === "POST") {
        return handleBackupData();
      } else if (path === "/api/skills/analyze" && method === "POST") {
        return handleAnalyzeSkills(request);
      } else if (path === "/api/notifications/send" && method === "POST") {
        return handleSendNotification(request);
      } else if (path === "/api/health" && method === "GET") {
        return handleHealthCheck();
      } else {
        return new Response("Not Found", {
          status: 404,
          headers: corsHeaders
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Internal Server Error",
        message: error.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
  }
};
async function handleGetUsers() {
  return new Response(JSON.stringify({
    success: true,
    data: users,
    count: users.length,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleGetUsers, "handleGetUsers");
async function handleRegisterUser(request) {
  const userData = await request.json();
  if (!userData.name || !userData.email) {
    return new Response(JSON.stringify({
      success: false,
      error: "Name and email are required"
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
  const existingUser = users.find((user) => user.email === userData.email);
  if (existingUser) {
    return new Response(JSON.stringify({
      success: false,
      error: "Email already exists"
    }), {
      status: 409,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
  const newUser = {
    id: users.length + 1,
    name: userData.name,
    email: userData.email,
    age: userData.age || null,
    skills: userData.skills || [],
    registeredAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  users.push(newUser);
  return new Response(JSON.stringify({
    success: true,
    data: newUser,
    message: "User registered successfully"
  }), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleRegisterUser, "handleRegisterUser");
async function handleValidateData(request) {
  const data = await request.json();
  const errors = [];
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format");
  }
  if (data.age && (data.age < 0 || data.age > 120)) {
    errors.push("Age must be between 0 and 120");
  }
  if (data.name && data.name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  }
  return new Response(JSON.stringify({
    success: errors.length === 0,
    valid: errors.length === 0,
    errors,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleValidateData, "handleValidateData");
async function handleGetSkills(url) {
  const userId = url.searchParams.get("userId");
  let filteredSkills = skills;
  if (userId) {
    filteredSkills = skills.filter((skill) => skill.userId == userId);
  }
  return new Response(JSON.stringify({
    success: true,
    data: filteredSkills,
    count: filteredSkills.length,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleGetSkills, "handleGetSkills");
async function handleAddSkill(request) {
  const skillData = await request.json();
  if (!skillData.name || !skillData.userId) {
    return new Response(JSON.stringify({
      success: false,
      error: "Skill name and userId are required"
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
  const newSkill = {
    id: skills.length + 1,
    userId: skillData.userId,
    name: skillData.name,
    category: skillData.category || "General",
    level: skillData.level || "Beginner",
    dateAdded: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  skills.push(newSkill);
  return new Response(JSON.stringify({
    success: true,
    data: newSkill,
    message: "Skill added successfully"
  }), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleAddSkill, "handleAddSkill");
async function handleUpdateSkill(request, path) {
  const skillId = parseInt(path.split("/").pop());
  const updateData = await request.json();
  const skillIndex = skills.findIndex((skill) => skill.id === skillId);
  if (skillIndex === -1) {
    return new Response(JSON.stringify({
      success: false,
      error: "Skill not found"
    }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
  skills[skillIndex] = { ...skills[skillIndex], ...updateData };
  return new Response(JSON.stringify({
    success: true,
    data: skills[skillIndex],
    message: "Skill updated successfully"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleUpdateSkill, "handleUpdateSkill");
async function handleDeleteSkill(path) {
  const skillId = parseInt(path.split("/").pop());
  const skillIndex = skills.findIndex((skill) => skill.id === skillId);
  if (skillIndex === -1) {
    return new Response(JSON.stringify({
      success: false,
      error: "Skill not found"
    }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
  const deletedSkill = skills.splice(skillIndex, 1)[0];
  return new Response(JSON.stringify({
    success: true,
    data: deletedSkill,
    message: "Skill deleted successfully"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleDeleteSkill, "handleDeleteSkill");
async function handleGetSkillStats() {
  const stats = {
    totalSkills: skills.length,
    skillsByCategory: {},
    skillsByLevel: {},
    averageSkillsPerUser: 0,
    mostPopularSkills: []
  };
  skills.forEach((skill) => {
    stats.skillsByCategory[skill.category] = (stats.skillsByCategory[skill.category] || 0) + 1;
    stats.skillsByLevel[skill.level] = (stats.skillsByLevel[skill.level] || 0) + 1;
  });
  if (users.length > 0) {
    stats.averageSkillsPerUser = (skills.length / users.length).toFixed(2);
  }
  const skillCounts = {};
  skills.forEach((skill) => {
    skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
  });
  stats.mostPopularSkills = Object.entries(skillCounts).sort(([, a], [, b]) => b - a).slice(0, 5).map(([name, count]) => ({ name, count }));
  return new Response(JSON.stringify({
    success: true,
    data: stats,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleGetSkillStats, "handleGetSkillStats");
async function handleProcessEmailData(request) {
  const emailData = await request.json();
  const processedData = {
    id: Date.now(),
    recipient: emailData.recipient,
    subject: emailData.subject || "Processed Email",
    content: emailData.content,
    processedAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "processed",
    wordCount: emailData.content ? emailData.content.split(" ").length : 0,
    hasAttachment: emailData.hasAttachment || false
  };
  return new Response(JSON.stringify({
    success: true,
    data: processedData,
    message: "Email data processed successfully"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleProcessEmailData, "handleProcessEmailData");
async function handleGenerateReport(request) {
  const reportRequest = await request.json();
  const reportType = reportRequest.type || "user_summary";
  let reportData = {};
  switch (reportType) {
    case "user_summary":
      reportData = {
        totalUsers: users.length,
        totalSkills: skills.length,
        userList: users.map((user) => ({
          name: user.name,
          email: user.email,
          skillCount: skills.filter((skill) => skill.userId === user.id).length
        })),
        generatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      break;
    case "skill_analysis":
      reportData = {
        skillDistribution: {},
        levelDistribution: {},
        generatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      skills.forEach((skill) => {
        reportData.skillDistribution[skill.category] = (reportData.skillDistribution[skill.category] || 0) + 1;
        reportData.levelDistribution[skill.level] = (reportData.levelDistribution[skill.level] || 0) + 1;
      });
      break;
    default:
      reportData = {
        message: "Unknown report type",
        availableTypes: ["user_summary", "skill_analysis"],
        generatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
  }
  return new Response(JSON.stringify({
    success: true,
    reportType,
    data: reportData,
    message: "Report generated successfully"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleGenerateReport, "handleGenerateReport");
async function handleBackupData() {
  const backupData = {
    users,
    skills,
    backupId: `backup_${Date.now()}`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    version: "1.0",
    recordCount: {
      users: users.length,
      skills: skills.length
    }
  };
  return new Response(JSON.stringify({
    success: true,
    data: backupData,
    message: "Data backup created successfully"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleBackupData, "handleBackupData");
async function handleAnalyzeSkills(request) {
  const analysisRequest = await request.json();
  const userId = analysisRequest.userId;
  let userSkills = skills;
  if (userId) {
    userSkills = skills.filter((skill) => skill.userId == userId);
  }
  const analysis = {
    totalSkills: userSkills.length,
    skillCategories: {},
    levelDistribution: {},
    recommendations: [],
    strengths: [],
    improvementAreas: []
  };
  userSkills.forEach((skill) => {
    analysis.skillCategories[skill.category] = (analysis.skillCategories[skill.category] || 0) + 1;
    analysis.levelDistribution[skill.level] = (analysis.levelDistribution[skill.level] || 0) + 1;
  });
  if (analysis.levelDistribution["Advanced"] > 2) {
    analysis.strengths.push("Strong advanced skills foundation");
  }
  if (analysis.levelDistribution["Beginner"] > analysis.levelDistribution["Advanced"]) {
    analysis.improvementAreas.push("Consider advancing beginner skills");
    analysis.recommendations.push("Focus on practicing beginner skills to reach intermediate level");
  }
  if (analysis.skillCategories["Communication"] < 2) {
    analysis.recommendations.push("Consider learning more communication skills");
  }
  return new Response(JSON.stringify({
    success: true,
    userId,
    data: analysis,
    analyzedAt: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleAnalyzeSkills, "handleAnalyzeSkills");
async function handleSendNotification(request) {
  const notificationData = await request.json();
  const notification = {
    id: `notif_${Date.now()}`,
    recipients: notificationData.recipients || [],
    message: notificationData.message,
    type: notificationData.type || "info",
    sentAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "sent",
    deliveryCount: notificationData.recipients ? notificationData.recipients.length : 0
  };
  return new Response(JSON.stringify({
    success: true,
    data: notification,
    message: "Notification sent successfully"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleSendNotification, "handleSendNotification");
async function handleHealthCheck() {
  return new Response(JSON.stringify({
    status: "healthy",
    service: "FIT5032 Cloud Functions",
    version: "1.0.0",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: "Running",
    functions: {
      total: 13,
      available: [
        "getUsers",
        "registerUser",
        "validateData",
        "getSkills",
        "addSkill",
        "updateSkill",
        "deleteSkill",
        "getSkillStats",
        "processEmailData",
        "generateReport",
        "backupData",
        "analyzeSkills",
        "sendNotification"
      ]
    }
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(handleHealthCheck, "handleHealthCheck");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-tRjly1/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-tRjly1/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
