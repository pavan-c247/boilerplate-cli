"use client";

import { useTranslations } from "next-intl";
import { Col,Form, Row } from "react-bootstrap";

import { FILTER_MODE } from "@/constants";
import { DateFilterProps } from "@/types/filters";
import { getMinToDate, normalizeDateValues } from "@/utils/formatDate";

const DateFilter = ({ label, mode, value = [], onChange }: DateFilterProps) => {
  const [from, to] = value;
  const t = useTranslations("common");
  const handleFromChange = (val: string) => {
    const updated = normalizeDateValues(mode, [val, to]);
    onChange(updated);
  };

  const handleToChange = (val: string) => {
    const updated = normalizeDateValues(mode, [from, val]);
    onChange(updated);
  };

  return (
    <Form.Group>
      <Form.Label className="fw-semibold">{label}</Form.Label>
      {mode === FILTER_MODE.RANGE ? (
        <Row className="g-2">
          <Col>
            <Form.Label className="text-muted mb-1">
              {t("filter.from")}
            </Form.Label>
            <Form.Control
              type="date"
              value={from || ""}
              onChange={(e) => handleFromChange(e.target.value)}
            />
          </Col>

          <Col>
            <Form.Label className="text-muted mb-1">
              {t("filter.to")}
            </Form.Label>
            <Form.Control
              type="date"
              value={to || ""}
              min={getMinToDate(from)}
              disabled={!from}
              onChange={(e) => handleToChange(e.target.value)}
            />
          </Col>
        </Row>
      ) : (
        <Form.Control
          type="date"
          value={from || ""}
          onChange={(e) => handleFromChange(e.target.value)}
        />
      )}
    </Form.Group>
  );
};

export default DateFilter;
