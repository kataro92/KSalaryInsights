import {
  calculatePaternityLeave,
  resolvePaternityLeaveDays,
} from "@/src/engine/paternityLeave";

const dayParams = {
  normal_days: 5,
  surgery_or_preterm_days: 7,
  twins_days: 10,
  twins_surgery_days: 14,
  extra_days_per_child_from: 3,
  extra_days_per_child: 3,
  second_child_extended_from: "2026-07-01",
  second_child_min_days: 10,
};

describe("resolvePaternityLeaveDays", () => {
  it("sinh thường 1 con = 5", () => {
    const r = resolvePaternityLeaveDays(
      {
        birthDate: "2026-08-15",
        childOrder: "first",
        numChildren: 1,
        surgeryOrPreterm: false,
      },
      dayParams
    );
    expect(r.leaveDays).toBe(5);
  });

  it("phẫu thuật / sinh non 1 con = 7", () => {
    const r = resolvePaternityLeaveDays(
      {
        birthDate: "2026-08-15",
        childOrder: "first",
        numChildren: 1,
        surgeryOrPreterm: true,
      },
      dayParams
    );
    expect(r.leaveDays).toBe(7);
  });

  it("sinh đôi = 10", () => {
    const r = resolvePaternityLeaveDays(
      {
        birthDate: "2026-08-15",
        childOrder: "first",
        numChildren: 2,
        surgeryOrPreterm: false,
      },
      dayParams
    );
    expect(r.leaveDays).toBe(10);
  });

  it("sinh ba phẫu thuật = 17", () => {
    const r = resolvePaternityLeaveDays(
      {
        birthDate: "2026-08-15",
        childOrder: "first",
        numChildren: 3,
        surgeryOrPreterm: true,
      },
      dayParams
    );
    expect(r.leaveDays).toBe(17);
  });

  it("con thứ hai từ 01/07/2026 = 10", () => {
    const r = resolvePaternityLeaveDays(
      {
        birthDate: "2026-08-15",
        childOrder: "second",
        numChildren: 1,
        surgeryOrPreterm: false,
      },
      dayParams
    );
    expect(r.leaveDays).toBe(10);
  });

  it("con thứ hai trước 01/07/2026 sinh thường = 5", () => {
    const r = resolvePaternityLeaveDays(
      {
        birthDate: "2026-03-15",
        childOrder: "second",
        numChildren: 1,
        surgeryOrPreterm: false,
      },
      dayParams
    );
    expect(r.leaveDays).toBe(5);
  });
});

describe("TC-PAT money", () => {
  it("TC-PAT-01: avg 18tr, sinh thường → 3.750.000", () => {
    const r = calculatePaternityLeave({
      avgSalary6m: 18_000_000,
      birthDate: "2026-08-15",
      childOrder: "first",
      numChildren: 1,
      surgeryOrPreterm: false,
    });
    expect(r.leaveDays).toBe(5);
    expect(r.dailyRate).toBe(750_000);
    expect(r.amount).toBe(3_750_000);
  });

  it("TC-PAT-02: avg 10tr, phẫu thuật → 2.916.667", () => {
    const r = calculatePaternityLeave({
      avgSalary6m: 10_000_000,
      birthDate: "2026-08-15",
      childOrder: "first",
      numChildren: 1,
      surgeryOrPreterm: true,
    });
    expect(r.leaveDays).toBe(7);
    expect(r.amount).toBe(2_916_667);
  });

  it("TC-PAT-03: sinh đôi → 10 ngày × daily", () => {
    const r = calculatePaternityLeave({
      avgSalary6m: 18_000_000,
      birthDate: "2026-08-15",
      childOrder: "first",
      numChildren: 2,
      surgeryOrPreterm: false,
    });
    expect(r.leaveDays).toBe(10);
    expect(r.amount).toBe(7_500_000);
  });
});
